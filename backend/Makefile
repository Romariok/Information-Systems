back:
	mvn spring-boot:run -X

minio:
	cd minio-data && minio server . --console-address :9001

k6:
	k6 run ./src/main/resources/scripts/script.js

.PHONY: back minio k6
