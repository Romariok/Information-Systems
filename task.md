Roman Kobelev, [23.09.2024 15:41]
Внимание! У разных вариантов разный текст задания!
Реализовать информационную систему, которая позволяет взаимодействовать с объектами класса Movie, описание которого приведено ниже:

```java
public class Movie {
    private Long id; //Поле не может быть null, Значение поля должно быть больше 0, Значение этого поля должно быть уникальным, Значение этого поля должно генерироваться автоматически
    private String name; //Поле не может быть null, Строка не может быть пустой
    private Coordinates coordinates; //Поле не может быть null
    private java.time.LocalDate creationDate; //Поле не может быть null, Значение этого поля должно генерироваться автоматически
    private int oscarsCount; //Значение поля должно быть больше 0
    private Double budget; //Значение поля должно быть больше 0, Поле может быть null
    private long totalBoxOffice; //Значение поля должно быть больше 0
    private MpaaRating mpaaRating; //Поле не может быть null
    private Person director; //Поле не может быть null
    private Person screenwriter;
    private Person operator; //Поле может быть null
    private Long length; //Поле не может быть null, Значение поля должно быть больше 0
    private Long goldenPalmCount; //Значение поля должно быть больше 0, Поле может быть null
    private long usaBoxOffice; //Значение поля должно быть больше 0
    private String tagline; //Поле может быть null
    private MovieGenre genre; //Поле может быть null
}
public class Coordinates {
    private Double x; //Поле не может быть null
    private long y;
}
public class Person {
    private String name; //Поле не может быть null, Строка не может быть пустой
    private Color eyeColor; //Поле не может быть null
    private Color hairColor; //Поле может быть null
    private Location location; //Поле не может быть null
    private Long weight; //Поле не может быть null, Значение поля должно быть больше 0
    private Country nationality; //Поле не может быть null
}
public class Location {
    private Double x; //Поле не может быть null
    private long y;
    private Integer z; //Поле не может быть null
    private String name; //Поле может быть null
}
public enum MpaaRating {
    G,
    PG,
    PG_13,
    R,
    NC_17;
}
public enum MovieGenre {
    DRAMA,
    ADVENTURE,
    HORROR,
    FANTASY;
}
public enum Color {
    GREEN,
    BLUE,
    WHITE,
    BROWN;
}
public enum Country {
    RUSSIA,
    UNITED_KINGDOM,
    VATICAN,
    ITALY,
    THAILAND;
}
```
Разработанная система должна удовлетворять следующим требованиям:

Основное назначение информационной системы - управление объектами, созданными на основе заданного в варианте класса.
Необходимо, чтобы с помощью системы можно было выполнить следующие операции с объектами: создание нового объекта, получение информации об объекте по ИД, обновление объекта (модификация его атрибутов), удаление объекта. Операции должны осуществляться в отдельных окнах (интерфейсах) приложения.При получении информации об объекте класса должна также выводиться информация о связанных с ним объектах.
При создании объекта класса необходимо дать пользователю возможность связать новый объект с объектами вспомогательных классов, которые могут быть связаны с созданным объектом и уже есть в системе.
Выполнение операций по управлению объектами должно осуществляться на серверной части (не на клиенте), изменения должны синхронизироваться с базой данных.
На главном экране системы должен выводиться список текущих объетов в виде таблицы (каждый атрибут объекта - отдельная колонка в таблице). При отображении таблицы должна использоваться пагинация (если все объекты не помещаются на одном экране).
Нужно обеспечить возможность фильтровать/сортировать строки таблицы, которые показывают объекты (по значениям любой из строковых колонок). Фильтрация элементов должна производиться по неполному совпадению.
Переход к обновлению (модификации) объекта должен быть возможен из таблицы с общим списком объектов и из области с визуализацией объекта (при ее реализации).
При добавлении/удалении/изменении объекта, он должен автоматически появиться/исчезнуть/измениться в интерфейсах у других пользователей, авторизованных в системе.
Если при удалении объекта с ним связан другой объект, операция должна быть отменена, пользователю нужно сообщить о невозможности удаления объекта.
Пользователю системы должен быть предоставлен интерфейс для авторизации/регистрации нового пользователя. У каждого пользователя должен быть один пароль. Требования к паролю: пароль должен быть уникален. В системе предполагается использование следующих видов пользователей (ролей):незарегистрированные пользователи,обычные пользователи и администраторы. Если в системе уже создан хотя бы один администратор, зарегистрировать нового администратора можно только при одобрении одним из существующих администраторов (у администратора должен быть реализован интерфейс со списком заявок и возможностью их одобрения).
Редактировать и удалять объекты могут только пользователи, которые их создали, и администраторы (администраторы могут редактировать объекты, которые пользователь разрешил редактировать при создании).
Зарегистрированные пользователи должны иметь возможность просмотра всех объектов, но модифицировать (обновлять) могут только принадлежащие им (объект принадлежит пользователю, если он его создал). Для модификации объекта должно открываться отдельное диалоговое окно. При вводе некорректных значений в поля объекта должны появляться информативные сообщения о соответствующих ошибках.
В системе должен быть реализован отдельный пользовательский интерфейс для выполнения специальных операций над объектами:

Сгруппировать объекты по значению поля director, вернуть количество элементов в каждой группе.
Вернуть количество объектов, значение поля usaBoxOffice которых меньше заданного.
Вернуть массив объектов, значение поля tagline которых содержит заданную подстроку.
Получить список фильмов, не имеющих ни одного "Оскара".
Отобрать все "Оскары" у всех фильмов режиссёров, снявших хоть один фильм в указанном жанре.
Представленные операции должны быть реализованы в качестве функций БД, которые необходимо вызывать из уровня бизнес-логики приложения.

Особенности хранения объектов, которые должны быть реализованы в системе:

Организовать хранение данных об объектах в реляционной СУБД (PostgreSQL). Каждый объект, с которым работает ИС, должен быть сохранен в базе данных.
Все требования к полям класса (указанные в виде комментариев к описанию классов) должны быть выполнены на уровне ORM и БД.
Для генерации поля id использовать средства базы данных.
Пароли при хранении хэшировать алгоритмом MD5.
При хранении объектов сохранять информацию о пользователе, который создал этот объект, а также фиксировать даты и пользователей, которые обновляли и изменяли объекты. Для хранения информации о пользователях и об изменениях объектов нужно продумать и реализовать соответствующие таблицы.
Таблицы БД, не отображающие заданные классы объектов, должны содержать необходимые связи с другими таблицами и соответствовать 3НФ.
Для подключения к БД на кафедральном сервере использовать хост pg, имя базы данных - studs, имя пользователя/пароль совпадают с таковыми для подключения к серверу.
При создании системы нужно учитывать следующие особенности организации взаимодействия с пользователем:

Система должна реагировать на некорректный пользовательский ввод, ограничивая ввод недопустимых значений и информируя пользователей о причине ошибки.
Переходы между различными логически обособленными частями системы должны осуществляться с помощью меню.
Во всех интерфейсах системы должно быть реализовано отображение информации о текущем пользователе (кто авторизован) и предоставляться возможность изменить текущего пользователя.
В отдельном окне ИС должна осуществляться визуализация объектов коллекции. При визуализации использовать данные о координатах и размерах объекта. Объекты от разных пользователей должны быть нарисованы разными цветами. При нажатии на объект должна выводиться информация об этом объекте.
При добавлении/удалении/изменении объекта, он должен автоматически появиться/исчезнуть/измениться на области у всех других клиентов.
При разработке ИС должны учитываться следующие требования:

В качестве основы для реализации ИС необходимо использовать Spring MVC.
Для создания уровня хранения необходимо использовать Hibernate.
Разные уровни приложения должны быть отделены друг от друга, разные логические части ИС должны находиться в отдельных компонентах.

Добавить в систему возможность массового добавления объектов при помощи импорта файла. Формат для импорта необходимо согласовать с преподавателем. Импортируемый файл должен загружаться на сервер через интерфейс разработанного веб-приложения.
При реализации логики импорта объектов необходимо реализовать транзакцию таким образом, чтобы в случае возникновения ошибок при импорте, не был создан ни один объект.
При импорте должна быть реализована проверка пользовательского ввода в соответствии с ограничениями предметной области из ЛР1.
При наличии вложенных объектов в основной объект из ЛР1 необходимо задавать значения полей вложенных объектов в той же записи, что и основной объект.
Необходимо добавить в систему интерфейс для отображения истории импорта (обычный пользователь видит только операции импорта, запущенные им, администратор - все операции).
В истории должны отображаться id операции, статус ее завершения, пользователь, который ее запустил, число добавленных объектов в операции (только для успешно завершенных).
Согласовать с преподавателем и добавить в модель из первой лабораторной новые ограничения уникальности, проверяемые на программном уровне (эти новые ограничения должны быть реализованы в рамках бизнес-логики приложения и не должны быть отображены/реализованы в БД).
Реализовать сценарий с использованием k6, имитирующий одновременную работу нескольких пользователей с ИС, и проверить корректность изоляции транзакций, используемых в ЛР. По итогам исследования поведения системы при ее одновременном использовании несколькими пользователями изменить уровень изоляции транзакций там, где это требуется. Обосновать изменения.
Реализованный сценарий должен покрывать создание, редактирование, удаление и импорт объектов.
Реализованный сценарий должен проверять корректность поведения системы при попытке нескольких пользователей обновить и\или удалить один и тот же объект (например, двух администраторов).
Реализованный сценарий должен проверять корректность соблюдения системой ограничений уникальности предметной области при одновременной попытке нескольких пользователей создать объект с одним и тем же уникальным значением.

Реализовать сохранение загруженных на сервер файлов, используемых для импорта данных, в файловом хранилище MinIO (можно взять любое другое S3-совместимое хранилище). Поднять и настроить MinIO требуется самостоятельно. Загруженные файлы должны быть доступны для скачивания из таблицы с логом импорта.
Сохранение загруженных файлов в файловом хранилище должно быть реализовано транзакционно по отношению к операциям, реализующим непосредственную вставку объектов в БД при импорте.
Для реализации распределенной транзакции из пункта 2 разрешается использовать любые инструменты. Рекомендуется решать задачу при помощи собственной реализации двух фазного коммита.
Необходимо на защите быть готовым продемонстрировать корректность реализованной распределенной транзакции в следующих условиях:
отказ файлового хранилища (БД продолжает работать)
отказ БД (файловое хранилище продолжает работать)
ошибка в бизнес-логике сервера (работают и БД, и файловое хранилище, однако в коде сервера вылетает RuntimeException между запросами в разные источники данных)
Необходимо на защите быть готовым продемонстрировать корректность работы распределенной транзакции в условиях параллельных запросов от нескольких пользователей (реализованный в ЛР 2 сценарий для k6, тестирующий функцию импорта, должен продолжать корректно отрабатывать).