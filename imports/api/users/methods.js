import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { User } from '../users/users.js';

Meteor.methods({
    'user.sendVerificationEmail'() {
        // throw new Meteor.Error(); // for testing
        let userId = Meteor.userId();
        if (userId) {
            Accounts.emailTemplates.siteName = "DeveloperLevel";
            Accounts.emailTemplates.from     = "DeveloperLevel <wayne@paladinarcher.com>";
            Accounts.emailTemplates.verifyEmail = {
                subject() {
                    return "[DeveloperLevel] Verify your email address";
                },
                text( user, url ) {
                    let emailAddress   = user.emails[0].address,
                        urlWithoutHash = url.replace( '#/', '' ),
                        supportEmail   = "support@developerlevel.com",
                        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.`;
                    return emailBody;
                }
            };
            return Accounts.sendVerificationEmail(userId);
        }
    },
    'user.setEmailNotifications'(notificationBool) {
        // throw new Meteor.error(); // for testing
        let userId = Meteor.userId();
        if (userId) {
            let u = User.findOne({_id:userId}); // change to Meteor.users.find...
            console.log("email Notifications changed from", u.MyProfile.emailNotifications);
            u.MyProfile.emailNotifications = notificationBool;
            u.save();
            console.log("email Notifications changed to", u.MyProfile.emailNotifications);
        }
    },

    // this function is unessesary as of 11/6/2018
    'user.getEmailNotifications'() {
        let userId = Meteor.userId();
        if (userId) {
            let u = User.findOne({_id:userId}); // change to Meteor.users.find...
            let notificationBool = u.MyProfile.emailNotifications;
            console.log("returning emailNotifications: ", notificationBool);
            return notificationBool;
        }
        else {
            console.log("error returning emailNotifications");
            return null;
        }
    },
    'user.sendNewVerificationEmail'(emailIndex) {
        let userId = Meteor.userId();
        if (userId) {
            Accounts.emailTemplates.siteName = "DeveloperLevel";
            Accounts.emailTemplates.from     = "DeveloperLevel <wayne@paladinarcher.com>";

            Accounts.emailTemplates.verifyEmail = {
                subject() {
                    return "[DeveloperLevel] Verify your email address";
                },
                text( user, url ) {
                    let emailAddress   = user.emails[emailIndex].address,
                        urlWithoutHash = url.replace( '#/', '' ),
                        supportEmail   = "support@developerlevel.com",
                        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.`;

                    return emailBody;
                }
            };
            return `Accounts`.sendVerificationEmail(userId);
        }
    },
    'user.sendNewVerificationEmail'(newEmail) {
        let userId = Meteor.userId();
        if (userId) {
            console.log("in sendNewVerificationEmail");

            // send email verification
            Accounts.emailTemplates.siteName = "DeveloperLevel";
            Accounts.emailTemplates.from     = "DeveloperLevel <carl@paladinarcher.com>";

            Accounts.emailTemplates.verifyEmail = {
                subject() {
                    return "[DeveloperLevel] Verify your email address";
                },
                text( user, url ) {
                    let emailAddress   = newEmail,
                        urlWithoutHash = url.replace( '#/', '' ),
                        supportEmail   = "support@developerlevel.com",
                        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.`;

                    return emailBody;
                }
            };
            return Accounts.sendVerificationEmail(userId);
        }

    },
    'user.toSetEmail'(newEmail) {
        console.log("entered user.setEmail");
        let emAlreadySet = false;
        let myEmails = Meteor.users.findOne({_id: Meteor.userId()}).emails;
        myEmails.forEach(function(e,i,a){
            if(a[i].address = newEmail) {
                emAlreadySet = true;
            }
        });
        if(!emAlreadySet) {
            Accounts.addEmail(Meteor.userId(), newEmail);
        }
    },
    'user.deleteEmail'(unwantedEmail) {
        console.log("Entered deleteEmail");
        let emailUser = User.findOne( {_id: Meteor.userId()} );
        console
        if (unwantedEmail != emailUser.emails[0].address)
        {
            Accounts.removeEmail(Meteor.userId(), unwantedEmail);
        }

    },
    'user.unverifyEmails'() {
        console.log("in unverifyEmails");
        // delete emails that aren't the main email
        let unverified = Meteor.users.findOne({_id: Meteor.userId()}).emails;
        unverified.forEach(function(e,i,a){a[i].verified=false});
        Meteor.users.update(
            { _id: Meteor.userId() },
            { $set: { 'emails': unverified }}
        );
    }
})
