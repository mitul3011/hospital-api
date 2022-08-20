const validator = require('validator');
const bcrypt = require('bcrypt');
const generateError = require('./generateError');

const validatePatientData = async (data) => {
    const patient = {};

    if(!data.name.match(/^[a-zA-Z ]+$/)){
        throw generateError('Name entered is not valid.', 400);
    }

    patient.name = validator.trim(data.name);

    if(!validator.isEmail(data.email)){
        throw generateError('Email entered is not valid.', 400);
    }

    patient.email = validator.trim(data.email).toLowerCase();

    if(!data.address.match(/^[a-zA-Z0-9\/\s.,'-]*$/)){
        throw generateError('Address entered is not valid.', 400);
    }

    patient.address = validator.trim(data.address);

    const strongPasswordOption = {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    };

    if(validator.isStrongPassword(data.password, strongPasswordOption) && data.password.length <= 15){
        if(data.password.toLowerCase().includes('password')){
            throw generateError('Password cannot contain "password"', 400);
        }

        patient.password = await bcrypt.hash(data.password, 8);

    }else{
        throw generateError('Passwords must contain minimum 8 and maximum 15 characters, including one upper, one lower, and one number.', 400);
    }

    if(data.phone_number !== '' && data.phone_number !== undefined){
        if(!validator.isMobilePhone(data.phone_number, 'any', { strictMode: true }))
            throw generateError('Enter phone number with country code.', 400);
        else
            patient.phone_number = validator.trim(data.phone_number);
    }

    return patient;
};

module.exports = validatePatientData;