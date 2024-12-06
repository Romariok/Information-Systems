import http from 'k6/http';
import { check, group, fail, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import exec from 'k6/execution';

export const options = {
  scenarios: {
    concurrent_users: {
      executor: 'ramping-vus',
      startVUs: 4,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '20s', target: 10 },
        { duration: '1s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],
  },
};

const BASE_URL = 'http://localhost:5252';
const importFileContent = open('./movies.yaml', 'b');
const SHARED_MOVIE_NAME = 'SharedMovie';


const testUsers = new SharedArray('users', function () {
  return [
    { username: 'userTest1', password: 'UserTest1' },
    { username: 'userTest2', password: 'UserTest2' },
  ];
});

function importMovies(token, fileContent) {
  const payload = {
    file: http.file(fileContent, "movies.yaml"),
  };
  return http.post(`${BASE_URL}/import`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: "60s",
  });
}

function login(username, password) {
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    username: username,
    password: password,
  }), {
    headers: { 'Content-Type': 'application/json' },
    timeout: '10s',
  });

  if (!check(loginRes, {
    'login successful': (r) => r.status === 200,
  })) {
    fail(`Login failed for user ${username}`);
  }

  return loginRes.json('token');
}

export function setup() {
  const token = login(testUsers[0].username, testUsers[0].password);
  const coordinates = createCoordinates(token);
  const director = createDirector(token);

  const responses = testUsers.map(user => {
    const token = login(user.username, user.password);
    const response = createMovie(token, SHARED_MOVIE_NAME, coordinates.json('id'), director.json('id'));
    return { user, token, response };
  });

  const successfulCreations = responses.filter(r => r.response.status === 200);

  if (successfulCreations.length === 0) {
    fail('Failed to create the shared movie for testing.');
  }
  return {
    sharedMovieId: successfulCreations[0].response.json('id'),
    coordinatesId: coordinates.json('id'),
    directorId: director.json('id'),
  };
}

function createCoordinates(token) {
  const coordinates = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10), adminCanModify: true };
  return http.post(`${BASE_URL}/coordinates`, JSON.stringify(coordinates), {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    timeout: '10s',
  });
}

function createLocation(token) {
  const location = { name: 'Location ' + Math.floor(Math.random() * 10), 
    x: Math.floor(Math.random() * 10), 
    y: Math.floor(Math.random() * 10), 
    z: Math.floor(Math.random() * 10), 
    adminCanModify: true };

  return http.post(`${BASE_URL}/location`, JSON.stringify(location), {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    timeout: '10s',
  });
}

function createDirector(token) {
  const locationId = createLocation(token).json('id');

  const director = { name: 'Director ' + Math.floor(Math.random() * 10), 
    weight: Math.floor(Math.random() * 10), 
    nationality: "RUSSIA", 
    eyeColor: "BLUE", 
    hairColor: "BLUE", 
    locationId: locationId,
    adminCanModify: true
  };

  const directorRes = http.post(`${BASE_URL}/person`, JSON.stringify(director), {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    timeout: '10s',
  });

  return directorRes;
}

function createMovie(token, movieName, coordinatesId, directorId) {
  const movie = {
    name: movieName,
    coordinatesId: coordinatesId,
    oscarsCount: Math.floor(Math.random() * 10),
    budget: Math.floor(Math.random() * 10),
    totalBoxOffice: Math.floor(Math.random() * 10),
    mpaaRating: "PG",
    directorId: directorId,
    length: Math.floor(Math.random() * 10),
    goldenPalmCount: Math.floor(Math.random() * 10),
    usaBoxOffice: Math.floor(Math.random() * 10),
    tagline: "Tagline " + Math.floor(Math.random() * 10),
    genre: "ADVENTURE",
    adminCanModify: true
  };

  return http.post(`${BASE_URL}/movie`, JSON.stringify(movie), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    timeout: '10s',
  });
}

export default function (data) {
  let movieId = data.sharedMovieId;
  const coordinatesId = data.coordinatesId;
  const directorId = data.directorId;

  const userCreds = testUsers[exec.vu.iterationInScenario % testUsers.length];
  const token = login(userCreds.username, userCreds.password);

  group('Update Shared Movie', () => {
    const updatedName = `UpdatedMovie_${Math.random().toString(36).substring(7)}`;
    const response = http.patch(`${BASE_URL}/movie/${movieId}`, JSON.stringify({
      id: movieId,
      name: updatedName,
      coordinatesId: coordinatesId,
      oscarsCount: 20,
      budget: 30,
      totalBoxOffice: 200,
      mpaaRating: "NC_17",
      directorId: directorId,
      length: 200,
      goldenPalmCount: 5,
      usaBoxOffice: 200,
      tagline: "Updated Tagline",
      genre: "DRAMA",
      adminCanModify: true
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: '10s',
    });

    check(response, {
      'shared movie update handled correctly': (r) => 
        r.status === 200 || r.status === 400,
    });
    if (response.status !== 200 && response.status !== 400) {
      console.log(response.status + "Update Shared Movie");
      console.log(response.json());
    }
    else{
      movieId = response.json('id');
    }
  });

  group('Delete Shared Movie', () => {
    const response = http.del(`${BASE_URL}/movie/${movieId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: '10s',
    });

    check(response, {
      'shared movie deletion handled correctly': (r) => 
        [400, 200].includes(r.status),
    });

    if (response.status !== 200 && response.status !== 400) {
      console.log(response.status + "Delete Shared Movie");
      console.log(response.json());
    }
  });

  group('Create Movie with Duplicate Name', () => {
    const response = createMovie(token, SHARED_MOVIE_NAME, coordinatesId, directorId)

    if (response.status == 200) {
      data.sharedMovieId = response.json('id');
      movieId = response.json('id');
    }

    check(response, {
      'duplicate movie creation handled correctly': (r) => 
        r.status === 400 || r.status === 200,
    });

    if (response.status !== 200 && response.status !== 400) {
      console.log(response.status + "Create Movie with Duplicate Name");
      console.log(response.json());
    }
  });

  group('Import Movie Concurrently', () => {
    const response = importMovies(token, importFileContent);

    check(response, {
      'import movies handled correctly': (r) => 
        r.status === 200 || r.status === 400,
    });

    if (response.status !== 200 && response.status !== 400) {
      console.log(response.status + "Import Movie Concurrently");
      console.log(response.json());
    }
  });

  sleep(0.5);
}