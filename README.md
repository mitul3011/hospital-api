# Hospital-API
This API created using Node.JS, Express.JS framework and MySQL is used as database.
This collection contains following requests,
* Register Patient - POST request
* Fetch Hospital Data - GET request

### 1. Register Patient - POST request
* API Endpoint to Register a patient in the system.
* Form Data to be provoded,  ``` name, email, address, phone number with country code(if provided), password, photo, psychiatristID(who is registering the user) ```.
* A Successful registration will result in a `HTTP 201` Status code.
* If invalid data provided in the form then it will result in `HTTP 400` Status code and error message.

### 2. Fetch Hospital Data - GET request
* API Endpoint to fetch hospital data from the system.
* Body to be provided,  ``` hospitalID ```.
* A Successful API request will result in a `HTTP 200` Status code and it will provide hospital data.
* If invalid hospitalID provided in the body of the request then it will result in `HTTP 404` Status code and error message.

**POSTMAN Documentation for API, [Click here](https://documenter.getpostman.com/view/22922895/VUqoSKKJ).**

Libraries used, 
* bcrypt - to hash the passwords.
* multer - to parse multipart/form-data and to support upload photo functionality.
* sharp - to convert every image in `.png` format and to resize every image in `250X250px`.
* validator - to validate the input data.
* mysql - to connect to the MySQL database and perform queries.
* env-cmd - to use custom environment variables.

**To run this project,**
1. Open Git Bash and change the working directory where you want to save locally and run `git clone https://github.com/mitul3011/hospital-api.git` command.
2. Open terminal and set path to where project is stored locally and run `npm i` command.
3. Start MySQL Server.
4. Run `npm run start` command in the terminal.
