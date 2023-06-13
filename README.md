# DuckMart API
## Live: [api.duckmart.tech](http://api.duckmart.tech)
DuckMart API is a RESTful API built on ExpressJS and NodeJS that supports JSON based HTTP requests and responses. This API is designed to provide valuable information about the users of the e-commerce platform DuckMart.

With DuckMart API, you can get detailed information about users, as well as a track of all the events that a user has performed on the DuckMart platform. The API is capable of converting JSON requests to SQL queries that are executed on the backend database, which is DuckDB in this case.

### The project has two independent components:
-  Data Import and Processing `[MANDATORY FOR FIRST TIME PROJECT SETUP]`
-  REST API

## Data Import and Processing Flow
![Screenshot from 2023-03-26 02-23-24](https://user-images.githubusercontent.com/33064931/227743872-f06154a3-c3f3-4289-b6a6-d359a16876dc.png)

### **Data Processing/ Transform**
`data` folder contains three folders for the following three types of files supported by DuckDB for import:
-  **.csv**
-  **.json**
-  **.parguet**

#### `transform.py` transforms data of the above mentioned files into one another

**Steps to transform data from one format to other:**
1. Add the data file to it's respective folder.
2. Run transform.py with following syntax arguments:
```
USAGE:
    python3 transform.py <PATH_TO_SOURCE_FILE> <PATH_TO_DESTINATION_FILE>
ARGS:
    <PATH_TO_SOURCE_FILE> <PATH_TO_DESTINATION_FILE>
EXAMPLES:
    python3 transform.py csv/MOCK_DATA_USER.csv json/MOCK_DATA_USER.json
    python3 transform.py json/MOCK_DATA_USER.json json/MOCK_DATA_USER.parquet
```
3. Converted file is saved in the destination.

### **Data Import/ Loading**
`DataFeeder.js` loads data form a scpecific file to a specific table on a specific server.

**Steps to import data in the database:**
1. Add the data file to it's respective folder.
2. Run DataFeeder.js with following syntax arguments:
```
USAGE:
    node DataFeeder.js <TABLE_NAME> <PATH_TO_DATABASE_FILE> <PATH_TO_DATA_FILE>
ARGS:
    <PATH_TO_DATABASE_FILE> <PATH_TO_DATA_FILE>
EXAMPLES:
    node DataFeeder.js
    node DataFeeder.js users ../db/duckmart.db ../data/csv/MOCK_DATA_USERS.csv
    node DataFeeder.js events ../db/duckmart.db ../data/csv/MOCK_DATA_EVENTS.csv
```

> If the `.db` database file does not exist it is created.

## REST API Architecture
![duckmart](https://user-images.githubusercontent.com/33064931/227743987-94743e84-05fb-4ede-ad66-65c333bdec72.png)


### The project is build on a modular architecture where features and functionalities and distributed among modules and functions.

## Database Schema
![Screenshot from 2023-03-26 03-14-34](https://user-images.githubusercontent.com/33064931/227743904-ee8762e4-7847-4f59-b48b-3de4c66962ca.png)


# Documentation:
## Getting Started

### Endpoints:
-  **users:** It provides user data based of the request filters. [(api.duckmart.tech/users)](http://api.duckmart.tech/users)
-  **events:** It provides events data based of the request filters. [(api.duckmart.tech/users)](http://api.duckmart.tech/events)
-  **queries:** It provides DuckDB-SQL queries to the request. [(api.duckmart.tech/users)](http://api.duckmart.tech/queries)

### POST Request Format:

```json
{
    "columns":["user_id","name","age","gender","device_type","event_name","timestamp"],
    "user_id": "077de7b4-9c34-4120-8b47-f5a63165bd5b",
    "name": "Ardelia Petche",
    "age": {"range":[20,50]},
    "gender": ["Male","Female"],
    "location": "China",
    "signup_date": {"range":["02-02-2023","20-05-2024"]},
    "subscription_plan": "Pro",
    "device_type": "Mobile"
}
```

Response to the above request on [api.duckmart.tech/users](http://api.duckmart.teck/users):
```json
[
    {
        "user_id": "077de7b4-9c34-4120-8b47-f5a63165bd5b",
        "name": "Ardelia Petche",
        "age": 43,
        "gender": "Female",
        "device_type": "Mobile",
        "event_name": "LOGOUT",
        "timestamp": "2022-08-13T00:00:00.000Z"
    },
    {
        "user_id": "077de7b4-9c34-4120-8b47-f5a63165bd5b",
        "name": "Ardelia Petche",
        "age": 43,
        "gender": "Female",
        "device_type": "Mobile",
        "event_name": "LOGOUT",
        "timestamp": "2022-07-07T00:00:00.000Z"
    }
]
```


**The JSON payload has two basic categories of items/filters:**
-  **Columns Filter :** Specifies which columns are to be presented. If not specified explicitly all the columns of the endpoint's table are presented.
-  **Search Filter :** Specifies the search parameters. Data is searched in the database based of these filters.

In the above example `columns` is a column filter specifying which columns to present.
```json
"columns":["user_id","name","age","gender","device_type","event_name","timestamp"]
```
On the other hand, `user_id`,`name`,`age`,`location`, etc are search filters defining attributes that are matched and evaluated for reponse.
```json
    "user_id": "077de7b4-9c34-4120-8b47-f5a63165bd5b",
    "name": "Ardelia Petche",
    "age": {"range":[20,50]},
    "gender": ["Male","Female"],
    "location": "China",
    "signup_date": {"range":["02-02-2023","20-05-2024"]},
    "subscription_plan": "Pro",
    "device_type": "Mobile"
```

Search and Column filters are all the columns of `users` and `events` tables combined:
  - user_id
  - name
  - age
  - gender
  - signup_date
  - subscription_plan
  - device_type
  - event_name
  - timestamp

**Special Value Types:**
-  **range:** Range is used to match for a list of values that fall within a range. It can only be applied to `Iterable` types.
Iterable types are:
   -  age
   -  signup_date
   -  timestamp

Syntax:
```
attribute: { "range":[lower_bound,upper_bound] }
```
Example:      
```json
"range":[10,50]
```

<br>

-  **list:** Used to match for all the items specified within the list, i.e. inside the block brackets `[]`.

Syntax:
```
attribute: [value1, value2, value3, ...]
```
Example:
```json
"age":[10,50]
```

### Response is a standard JSON object.

## Tech Stack:
-  NodeJS
-  ExpressJS
-  DuckDB
-  Python
-  Regex
-  Pandas
-  DigitalOcean Droplet

# Features of DuckMart API

-  **Scalable, Robust and Reliable:** DuckMart API is built on the Express framework, which is designed to handle `high-traffic` applications with ease. The API is also designed to be `horizontally scalable`, meaning that it can be deployed across multiple servers to handle increasing loads.
-  **Responsible Error Handling:** The API is designed to `handle errors gracefully` and provide meaningful error messages and status codes to users.
-  **Secure:** DuckMart API takes security seriously and implements measures to protect against common security threats. For example, the API is designed to prevent `SQL injection` attacks by using prepared statements, parameterized queries and regular expressions (regex).
-  **Architecture Support:** DuckMart API supports both `monolithic and microservice` architectures. The monolithic architecture is suitable for small to medium-sized applications that can be easily managed within a single codebase. The microservice architecture is suitable for large, complex applications that require more scalability and flexibility.
-  **Highly automate-able:** DuckMart API is designed to be highly automatable, thanks to its design choices, modularity and CLI-based approach to scripts, it can be `easily automated` using scripts and can be pipelined in CI/CD workflows with GitHub Actions as well.

# Development
1. Install Node.js and NPM on your machine. [version `18`.x recommended]
2. Clone the DuckMart API repository from GitHub.
3. Install the required dependencies using NPM
```bash
npm install
```
```bash
npm i nodemon -D
```
```bash
npm i nodemon -D -g
```
4. Create a `.env` file with the following content:
```
PORT=[PORT YOU WANT TO SPECIFY]
```
5. Perform the initial data transformation and data import steps to create a `.db` persistend database file as decribed above in Data Import steps.
6. Start the API server using the `nodemon index.js` command.
```bash
nodemon index.js
```
7. Use an HTTP client or Postman to make requests to the API.


# Conclusion
DuckMart API is a reliable, scalable, and robust choice for any ecommerce platform. With its support for both monolithic and microservice architectures, and its implementation of security measures like protection against SQL injection, DuckMart API is the perfect choice for any business looking to build a robust and secure ecommerce platform.

# Support
You can reach out to me on the below handles:
<p align="center">
  <a href="https://www.linkedin.com/in/ayush-dubey-/"><img width="32px" alt="LinkedIn" title="LinkedIn" src="https://user-images.githubusercontent.com/33064931/192891277-e2528754-fdca-473a-be7a-25149ae295c8.png"></a>
  &#8287;&#8287;&#8287;&#8287;&#8287;
  <a href="https://www.instagram.com/_iam.ayush_/"><img width="32px" alt="Instagram" title="Instagram" src="https://user-images.githubusercontent.com/33064931/192891342-3c88a026-50f3-430d-b582-96a57b019e32.png"/></a>
  &#8287;&#8287;&#8287;&#8287;&#8287;
  <a href="https://www.youtube.com/c/ADIDAT"><img width="32px" alt="Youtube" title="Youtube" src="https://user-images.githubusercontent.com/33064931/192891435-24b5573e-5715-484a-b398-1db38348d9ea.png"/></a>
  &#8287;&#8287;&#8287;&#8287;&#8287;
  <a href="https://twitter.com/thatshityguy"><img width="32px" alt="Twitter" title="Twitter" src="https://user-images.githubusercontent.com/33064931/192891530-8660cc3a-3721-4609-a99d-010d7dd5d6d7.png"/></a>
  &#8287;&#8287;&#8287;&#8287;&#8287;
</p> &nbsp;

<br> &nbsp;


---

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=10470981&assignment_repo_type=AssignmentRepo)
## Houseware

### Company information 

Houseware's vision is to empower the next generation of knowledge workers by putting the data warehouse in their hands, in the language they speak. Houseware is purpose-built for the Data Cloud’s untouched creators, empowering internal apps across organizations. 

### Why participate in an Octernship with Houseware

Houseware is changing the way the data warehouse is leveraged, and we want you to help build Houseware! Our team came together to answer the singular question, "how can we flip the value of the data warehouse to the ones who really need it, to the ones who drive decisions". 

In this role, you'll have the opportunity to work as a Data engineer with the Houseware team on multiple customer-facing projects. You'd be involved with delivering the data platform for the end user, while taking complete ownership of engineering challenges - this would include communicating with the stakeholders, setting the right expectations, and ensuring top quality for the code & the product being shipped.

### Octernship role description

We're looking for data engineers to join the Houseware team. 

We are hell-bent on building a forward-looking product, something that constantly pushes us to think by first principles and question assumptions, building a team that is agile in adapting and ever curious. While fast-paced execution is one of the prerequisites in this role, equally important is the ability to pause and take stock of where product/engineering is heading from a long-term perspective. Your initiative is another thing that we would expect to shine through here, as you continuously navigate through ambiguous waters while working with vigor on open-ended questions - all to solve problems for and empathize with the end users.

| Octernship info  | Timelines and Stipend |
| ------------- | ------------- |
| Assignment Deadline  | 26 March 2023  |
| Octernship Duration  | 3-6 Months  |
| Monthly Stipend  | $600 USD  |

### Recommended qualifications

- You have a solid problem-solving framework.
- You are well-versed with the Modern Data Stack, and have worked with Cloud Data Warehouses before
- You have prior experience writing backend systems, and are proficient in SQL/dbt.

### Eligibility

To participate, you must be:

* A [verified student](https://education.github.com/discount_requests/pack_application) on Global Campus

* 18 years or older

* Active contributor on GitHub (monthly)

# Assignment

## Segment users on DuckMart!

### Task instructions

You have been given a task to segment the user audience for a fictional online service called "DuckMart". You have to design and implement a backend service that allows for segmenting the user audience based on user attributes and user events.

As part of this activity, you'll have to do the following
- Dummy data generation: Create dummy data using tools like Mockaroo
- Data transformation: Write a Python script to transform the data from the CSV files into a format suitable for loading into the database.
- Data loading: You are required to load the transformed data into DuckDB

Database Schema: The following are the requirements for the database schema:

- User Attributes: User ID, Name, Age, Gender, Location, Signup Date, Subscription Plan, Device Type.
- User Events: User ID, Event Name, Timestamp.

A few examples of events are "PURCHASE_MADE" or "ADDED_TO_CART".

Query Requirements: The following are the requirements for the queries:

- Segment users by age groups: Create a segment of users in the age range 25-34 years and list out the user IDs of all such users.
- Segment users by location and events: Create a segment of users whose location="California" and have logged in to the product at least once(event_name='LOGIN') and list out the User IDs of all such users.

You are then required to write out a backend API endpoint that can scale to any kind of "Segmentation usecase" like the two examples mentioned above. Building on top of the mentioned data schema(Users, Events), the consumer of this API should be able to specify the segmentation criteria in a JSON-like format and the backend API should be able to convert it into the relevant SQL. Please specify what the spec for the JSON-like payload looks like.

### Task Expectations

You will be evaluated based on the following criteria:
- Correctness and completeness of the implementation.
- The JSON spec that powers the "Segmentation API"
- Performance and scalability of the implementation.
- Quality of the SQL queries and their optimization.
- Quality of the code and documentation.
- Ability to explain and justify design decisions.

### Task submission

Students are expected to use the [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow) when working on their project. 

1. Making changes on the auto generated `feedback` branch to complete the task
2. Using the auto generated **Feedback Pull Request** for review and submission
3. Using GitHub Discussions to ask any relevant questions regarding the project

