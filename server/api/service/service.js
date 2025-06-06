var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Repository } from '../repository/repository.js';
import bcrypt from 'bcrypt';
export class Service {
    constructor(db) {
        this.postSubmitJob = (user_id, company_name, applied_position, company_address, date_applied, country_id, company_website, status_id, additional_notes) => __awaiter(this, void 0, void 0, function* () {
            if (!company_address) {
                company_address = null;
            }
            if (!company_website) {
                company_website = null;
            }
            if (!additional_notes) {
                additional_notes = null;
            }
            try {
                yield this.repository.postSubmitJob(user_id, company_name, applied_position, company_address, date_applied, country_id, company_website, status_id, additional_notes);
                return { message: 'Job submitted successfully', status: 201, isError: false, data: null };
            }
            catch (error) {
                return { message: error.message || 'Error submitting job', status: 500, isError: true, data: null };
            }
        });
        this.postSubmitContact = (user_id, role_in_company, phone_number, contact_email, linkedin_profile) => __awaiter(this, void 0, void 0, function* () {
            if (!linkedin_profile) {
                linkedin_profile = null;
            }
            try {
                yield this.repository.postSubmitContact(user_id, role_in_company, phone_number, contact_email, linkedin_profile);
                return { message: 'Contact submitted successfully', status: 201, isError: false, data: null };
            }
            catch (error) {
                return { message: error.message || 'Error submitting contact', status: 500, isError: true, data: null };
            }
        });
        this.postLogin = (email, password, req) => __awaiter(this, void 0, void 0, function* () {
            if (!email || !password) {
                return { message: 'Empty credentials', status: 400, isError: true, data: null };
            }
            try {
                const existingAccount = yield this.repository.postLogin(email);
            }
            catch (error) {
                return { message: error.message || 'Error during login', status: 500, isError: true, data: null };
            }
            try {
                const queryResult = yield this.repository.postLogin(email);
                if (queryResult.length > 0 && (yield bcrypt.compare(password, queryResult[0]['password_hash']))) {
                    req.session.user_id = queryResult[0]['user_id'];
                    const userDetails = { user_id: queryResult[0]['user_id'] };
                    return { message: 'Login successful', status: 200, isError: false, data: userDetails };
                }
                else {
                    return { message: 'Incorrect credentials', status: 401, isError: true, data: null };
                }
            }
            catch (error) {
                return { message: error.message || 'Error during login', status: 500, isError: true, data: null };
            }
        });
        this.postRegister = (email, password, password_confirmation) => __awaiter(this, void 0, void 0, function* () {
            let _this = this;
            if (!password || !email) {
                return { message: 'Empty credentials', status: 400, isError: true, data: null };
            }
            try {
                const salt = yield bcrypt.genSalt(3);
                bcrypt.hash(password, salt, function (err, password_hash) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            console.error("Error hashing password:", err);
                            return { message: 'Error during hashing', status: 500, isError: true, data: null };
                        }
                        try {
                            yield _this.repository.postRegister(email, password_hash);
                            return { message: 'Account registered successfully', status: 201, isError: false, data: null };
                        }
                        catch (error) {
                            console.error("Error saving user:", error);
                            return { message: error.message || 'Error during registration attempt', status: 500, isError: true, data: null };
                        }
                    });
                });
            }
            catch (error) {
                return { message: error.message || 'Error during registration attempt', status: 500, isError: true, data: null };
            }
            return { message: 'Error during registration attempt', status: 500, isError: true };
        });
        this.deleteContact = (user_id, contact_email) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repository.deleteContact(user_id, contact_email);
                return { message: 'Contact deleted successfully', status: 200, isError: false, data: null };
            }
            catch (error) {
                return { message: error.message || 'Error deleting contact', status: 500, isError: true, data: null };
            }
        });
        this.deleteJob = (user_id, company_name, applied_position, date_applied) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repository.deleteJob(user_id, company_name, applied_position, date_applied);
                return { message: 'Job deleted successfully', status: 200, isError: false, data: null };
            }
            catch (error) {
                return { message: error.message || 'Error deleting job', status: 500, isError: true, data: null };
            }
        });
        this.getJobs = (user_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield this.repository.getJobs(user_id);
                return { message: 'success', status: 200, isError: false, data: jobs };
            }
            catch (error) {
                return { message: error.message || 'Error fetching jobs', status: 500, isError: true, data: null };
            }
        });
        this.getContacts = (user_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const contacts = yield this.repository.getContacts(user_id);
                return { message: 'success', status: 200, isError: false, data: contacts };
            }
            catch (error) {
                return { message: error.message || 'Error fetching contacts', status: 500, isError: true, data: null };
            }
        });
        this.repository = new Repository(db);
    }
}
;
