var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { usersTable, jobsTable, recruiterContactsTable, applicationStatusEnum } from '../../db/schema.js';
import { NeonDbError } from "@neondatabase/serverless";
import { and, eq } from "drizzle-orm";
export class Repository {
    constructor(db) {
        this.deleteContact = (user_id, contact_email) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db
                    .delete(recruiterContactsTable)
                    .where(and(eq(recruiterContactsTable.user_id, user_id), eq(recruiterContactsTable.contact_email, contact_email)));
            }
            catch (error) {
                console.log(error);
                throw new Error("An error occured during database call.");
            }
            return;
        });
        this.deleteJob = (user_id, company_name, applied_position, date_applied) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db
                    .delete(jobsTable)
                    .where(and(eq(jobsTable.user_id, user_id), eq(jobsTable.company_name, company_name), eq(jobsTable.applied_position, applied_position), eq(jobsTable.date_applied, date_applied)));
            }
            catch (error) {
                console.log(error);
                throw new Error("An error occured during database call.");
            }
            return;
        });
        this.getJobs = (user_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield this.db
                    .select()
                    .from(jobsTable)
                    .where(eq(jobsTable.user_id, user_id));
                return jobs;
            }
            catch (error) {
                console.log(error);
                throw new Error("An error occured during database call.");
            }
        });
        this.getContacts = (user_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const contacts = yield this.db
                    .select()
                    .from(recruiterContactsTable)
                    .where(eq(recruiterContactsTable.user_id, user_id));
                return contacts;
            }
            catch (error) {
                console.log(error);
                throw new Error("An error occured during database call.");
            }
        });
        this.db = db;
    }
    postSubmitJob(user_id, company_name, applied_position, company_address, date_applied, country_id, company_website, status_id, additional_notes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db
                    .insert(jobsTable)
                    .values({
                    user_id: user_id,
                    company_name: company_name,
                    applied_position: applied_position,
                    company_address: company_address,
                    date_applied: date_applied,
                    country_id: country_id,
                    company_website: company_website,
                    status_id: applicationStatusEnum.enumValues[status_id],
                    additional_notes: additional_notes
                });
            }
            catch (error) {
                console.log(error);
                throw new Error("An error occured during database call.");
            }
            return;
        });
    }
    postSubmitContact(user_id, role_in_company, phone_number, contact_email, linkedin_profile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db
                    .insert(recruiterContactsTable)
                    .values({
                    user_id: user_id,
                    role_in_company: role_in_company,
                    phone_number: phone_number,
                    contact_email: contact_email,
                    linkedin_profile: linkedin_profile
                });
            }
            catch (error) {
                console.log(error);
                throw new Error('An error occured during database call.');
            }
        });
    }
    postLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var queryResult = yield this.db
                    .select({ user_id: usersTable.user_id, password_hash: usersTable.password_hash })
                    .from(usersTable)
                    .where(and(eq(usersTable.email, email)));
            }
            catch (error) {
                throw new Error("An errror occured during the database call.");
            }
            try {
                var user_id = queryResult[0]['user_id'];
            }
            catch (error) {
                throw new Error("Account with such credential is not found.");
            }
            return queryResult;
        });
    }
    postRegister(email, password_hash) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db
                    .insert(usersTable)
                    .values({
                    email: email,
                    password_hash: password_hash
                });
            }
            catch (error) {
                if (error instanceof NeonDbError) {
                    if (error.code == '23505') {
                        throw new Error("User with that email already exists.");
                    }
                }
                throw new Error('An error occured during the database call.');
            }
            ;
            return;
        });
    }
}
;
