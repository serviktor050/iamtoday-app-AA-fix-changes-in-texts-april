import {dict} from "../../../dict";

export function  validateEducation(data, lang, errors) {
    if (!data.partnerInfoEducations) {
        return
    }
    const partnerInfoEducationsArrayErrors = [];
    data.partnerInfoEducations.forEach((member, memberIndex) => {
        const partnerInfoEducationsErrors = {}
        if (!member || !member.university) {
            partnerInfoEducationsErrors.university = dict[lang]['profile.fieldCanNotEmpty'];
            partnerInfoEducationsArrayErrors[memberIndex] = partnerInfoEducationsErrors;
        }
        if (!member || !member.specialty) {
            partnerInfoEducationsErrors.specialty = dict[lang]['profile.fieldCanNotEmpty'];
            partnerInfoEducationsArrayErrors[memberIndex] = partnerInfoEducationsErrors;
        }
        if (!member || !member.endYear) {
            partnerInfoEducationsErrors.endYear = dict[lang]['profile.fieldCanNotEmpty'];
            partnerInfoEducationsArrayErrors[memberIndex] = partnerInfoEducationsErrors;
        }
        if (!member || !member.diplomaNumber) {
            partnerInfoEducationsErrors.diplomaNumber = dict[lang]['profile.fieldCanNotEmpty'];
            partnerInfoEducationsArrayErrors[memberIndex] = partnerInfoEducationsErrors;
        }
    });
    errors.partnerInfoEducations = partnerInfoEducationsArrayErrors
}

export function  validateInfoWorks(data, lang, errors) {
    if (!data.partnerInfoWorks) {
        return
    }
    const partnerInfoWorksArrayErrors = [];
    data.partnerInfoWorks.forEach((member, memberIndex) => {
        const partnerInfoWorksErrors = {}
        if (!member || !member.firmName) {
            partnerInfoWorksErrors.firmName = dict[lang]['profile.fieldCanNotEmpty'];
            partnerInfoWorksArrayErrors[memberIndex] = partnerInfoWorksErrors;
        }
        if (!member || !member.startDate) {
            partnerInfoWorksErrors.startDate = dict[lang]['profile.fieldCanNotEmpty'];
            partnerInfoWorksArrayErrors[memberIndex] = partnerInfoWorksErrors;
        }
        if (!member || !member.endDate) {
            partnerInfoWorksErrors.endDate = dict[lang]['profile.fieldCanNotEmpty'];
            partnerInfoWorksArrayErrors[memberIndex] = partnerInfoWorksErrors;
        }
        if (!member || !member.position) {
            partnerInfoWorksErrors.position = dict[lang]['profile.fieldCanNotEmpty'];
            partnerInfoWorksArrayErrors[memberIndex] = partnerInfoWorksErrors;
        }
    });
    errors.partnerInfoWorks = partnerInfoWorksArrayErrors
}

export function  validateDocuments(data, lang, errors) {
    if (data.partnerInfoDocuments && data.partnerInfoDocuments.length) {
        const partnerInfoDocumentsArrayErrors = [];
        const partnerInfoDocuments = data.partnerInfoDocuments.filter((item) => item.url);
        if (partnerInfoDocuments.length < 3) {
            let count = partnerInfoDocuments.length;
            while (count < 3) {
                partnerInfoDocumentsArrayErrors[count] = dict[lang]['profile.loadDoc'];
                count++;
            }
        }

        errors.partnerInfoDocuments = partnerInfoDocumentsArrayErrors
    }
}

export function  validateContacts(data, lang, errors) {

    if (!data.firstName) {
        errors.firstName = dict[lang]['profile.fieldCanNotEmpty']
    } else if (data.firstName.length > 100) {
        errors.firstName = dict[lang]['profile.nameMustLess']
    }

    if (!data.lastName) {
        errors.lastName = dict[lang]['profile.fieldCanNotEmpty']
    } else if (data.lastName.length > 100) {
        errors.lastName = dict[lang]['profile.clastNameMustLess']
    }

    if (!data.middleName) {
        errors.middleName = dict[lang]['profile.fieldCanNotEmpty']
    } else if (data.middleName.length > 100) {
        errors.middleName = dict[lang]['profile.clastNameMustLess']
    }

    if (data.phone && data.phone.length < 6) {
        errors.phone = dict[lang]['profile.telMustMore'];
    } else if (data.phone && data.phone.length > 30) {
        errors.phone = dict[lang]['profile.telMustLess'];
    } else if (data.phone && !/^[+\s0-9]{6,20}$/.test(data.phone)) {
        errors.phone = dict[lang]['profile.telMustContain'];
    }

    if (!data.email) {
        errors.email = 'Email должен быть заполнен'
    } else if (!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(data.email)) {
        errors.email = 'Email заполнен неправильно, проверьте его еще раз'
    }

    if (!data.agreed) {
        errors.agreed = dict[lang]['profile.needPermission']
    }

    return errors
}
