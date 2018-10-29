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

method: POST (create)  
endpoint: /survivor/  
input fields:  
```	
	{
		name: Arthur,
		age: 29,
		gender: Male,
		lastLocation.longitude: -16.6722709,
		lastLocation.latitude: -49.2689362,
		inventory: Water, Food, Ammunition
	}
```
Upon registration of the survivor, the system will set the "inventoryLocked" property to **false**, and "infectionFlagPoints" to 0:
```
	{
		"inventoryLocked": false,
		"infectionFlagPoints": 0
	}
```

**Update survivor location**

method: PUT (update)  
endpoint: /survivor/location  
input fields:  
```	
	{
		name: Arthur,
		lastLocation.longitude: -16.682199,
		lastLocation.latitude: -49.2795521,
	}
```

**Flag survivor as infected**

method: PUT (update)  
endpoint: /flag/infection  
input fields:  
```	
	{
		name: Arthur
	}
```

After flagging the survivor as infected, the system will increment a field in that survivor database entry:

```	
	{
		name: "Arthur",
		age: 29,
		gender: "Male",
		"lastLocation": {
			"longitude": -16.682199,
			"latitude": -49.2795521
		},
		"inventory": ["Water", "Food", "Ammunition"],
		"inventoryLocked": false,
		"infectionFlagPoints": 1
	}
```

After 3 flags, the "inventoryLocked" field will be set to **true**, stating that the survivor is contaminated by the virus.

**Trade items**

**Reports**

*Percentage of infected survivors*  

method: GET (read)  
endpoint: /survivors/infected

The system will return the percentage of Infected Survivors:

e.g.:

` "40.00%" `


*Percentage of non-infected survivors*  

method: GET (read)  
endpoint: /survivors/noninfected  

The system will return the percentage of Non-Infected Survivors:

e.g.:

` "60.00%" `

*Average amount of each kind of resource by survivor*  

method: GET (read)  
endpoint: /average/resources  

The system will return the average of each kind of resource by survivor:

e.g.:

```
[
    {
        "_id": "averageOfResources",
        "water": 3.25,
        "food": 3.25,
        "medication": 3,
        "ammunition": 1.25
    }
]
```

*Points lost because of infected survivor*  

method: GET (read)  
endpoint: /points/lost  

The system will return the total points lost by all the non survivors:

e.g.:

`54`

---
