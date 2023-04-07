const yup = require('yup');
const { OrgType,
    hospitalType,
    docType,
    patientType,
    phoneRegExp } = require('../config/config');

const { messageError } = require('./message');

const validatePatientSchema = yup
    .object({
        patientId: yup.string().required().matches(/^P-\d+$/, `${messageError.validPatient}`),
        firstName: yup.string().required().trim().min(2).max(50),
        lastName: yup.string().required().trim().min(2).max(50),
        email: yup.string().required().required().email(),
        userType: yup.string().required().oneOf([patientType.patienId]),
        city: yup.string().required(),
        address: yup.string().required(),
        state: yup.string().required()
    })
    .required();

const validateHospitalSchema = yup
    .object({
        hospitalId: yup.string().required().matches(/^H-\d+$/, `${messageError.validHospital}`),
        email: yup.string().required().email(),
        name: yup.string().required().trim().min(2).max(50),
        userType: yup.string().required().oneOf([OrgType.Patient, OrgType.Hospital, OrgType.Pharmacy]),
        type: yup.string().required().oneOf([hospitalType.Government, hospitalType.Private]),
        doctor: yup.array()
            .of(
                yup.object().shape({
                    docId: yup.string().required().matches(/^D-\d+$/, `${messageError.validDoctor}`),
                    name: yup.string().required().min(2).max(50).required(),
                    type: yup.string().required().oneOf([docType.dentist, docType.cardiologist]),
                })
            )
    })
    .required();

const validatePharmacySchema = yup
    .object({
        pharmacyId: yup.string().required().required().matches(/^PH-\d+$/, `${messageError.validPharmacy}`),
        email: yup.string().required().email(),
        name: yup.string().required().trim().min(2).max(50),
        userType: yup.string().required().oneOf([OrgType.Patient, OrgType.Hospital, OrgType.Pharmacy]),
        mobileNumber: yup.string().required().matches(phoneRegExp, `${messageError.validPhonenumber}`),
        city: yup.string().required(),
        state: yup.string().required().min(2)
    })
    .required();

const validateAppointmentSchema = yup
    .object({
        patientId: yup.string().required().matches(/^P-\d+$/, `${messageError.validPatient}`),
    })
    .required();

const validateUpdateAppointmentSchema = yup.object().shape({
    appointmentId: yup.string().required(),
    details: yup.object().shape({
        docId: yup.string().required().matches(/^D-\d+$/, `${messageError.validDoctor}`),
        hospitalId: yup.string().required().matches(/^H-\d+$/, `${messageError.validHospital}`),
        slotTime: yup.string().required(),
        slotDate: yup.string().required(),
        symptoms: yup.string().required()
    }),
    prescription: yup.object().shape({
        tablet1: yup.string().required(),
        syrup: yup.string().required()
    }),
    status: yup.string().required()
});

const validatePatient = async (PatientData) => {
    const data = validatePatientSchema.validateSync(PatientData);
    return data
}

const validateHospital = async (HospitalData) => {
    const data = validateHospitalSchema.validateSync(HospitalData);
    return data
}

const validatePharmacy = async (PharmacyData) => {
    const data = validatePharmacySchema.validateSync(PharmacyData);
    return data
}

const validateAppointment = async (PharmacyData) => {
    const data = validateAppointmentSchema.validateSync(PharmacyData);
    return data
}

const validateUpdateAppointment = async (PharmacyData) => {
    const data = validateUpdateAppointmentSchema.validateSync(PharmacyData);
    return data
}

module.exports = { validateHospital, validatePatient, validatePharmacy, validateAppointment, validateUpdateAppointment }