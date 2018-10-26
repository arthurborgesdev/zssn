# ZSSN - Zombie Survival Social Network - System guidelines

## System setup 

This system was created using the stack "MEN" (MongoDB, ExpressJS, NodeJS) to support life in this zombie crysis. Below are some links that help download and configure NodeJS and MongoDB:

[NodeJS](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

[MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

*Although these info is provided having a Ubuntu 18.04 in mind, we recommend that you follow your OS installation guide*


---

## System start

After everything is installed, start MongoDB and run the start script:

1. On a **Terminal**, run the command *mongod*;
2. Go to the **zssn** folder and open it in a **Terminal**;
3. Run **npm start**;

---

## System follow-up

After the system is started, open **Postman** to reach the endpoints.

---

## System endpoints

To access the system endpoints, enter each URL:

**Add survivors to the database**

method: POST (create) <br />
endpoint: /survivor/ <br />
input fields:
```	{
		"name": "Arthur",
		"age": 29,
		"gender": "Male",
		"lastLocation": [-16.6722709,-49.2689362],
		"inventory": ["Flashlight", "Smartphone", "Water-bottle"],
		"inventoryLocked": false
	}
```
**Update survivor location**

method: PUT (update) <br />
endpoint: /survivor/location <br />
input fields:
```	{
		"name": "Arthur",
		"lastLocation": [-16.682199,-49.2795521]
	}
```
**Flag survivor as infected**

**Trade items**

**Reports**

*Percentage of infected survivors* <br />
method: GET (read) <br />
endpoint: /survivor/infected

*Percentage of non-infected survivors* <br />
method: GET (read) <br />
endpoint: /survivor/noninfected 

*Average amount of each kind of resource by survivor* <br />
method: GET (read) <br />
endpoint: /survivor/resources

*Points lost because of infected survivor* <br />
method: GET (read) <br />
endpoint: /points/lost

---
