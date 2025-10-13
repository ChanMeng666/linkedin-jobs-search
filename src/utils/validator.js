const validateSearchParams = (params) => {
    const errors = [];

    if (params.salary && !['40000', '60000', '80000', '100000', '120000'].includes(params.salary)) {
        errors.push('Invalid salary range');
    }

    if (params.experienceLevel && !['internship', 'entry level', 'associate', 'senior', 'director', 'executive'].includes(params.experienceLevel)) {
        errors.push('Invalid experience level');
    }

    if (params.jobType && !['full time', 'part time', 'contract', 'temporary', 'volunteer', 'internship'].includes(params.jobType)) {
        errors.push('Invalid job type');
    }

    if (params.has_verification !== undefined && typeof params.has_verification !== 'boolean' && params.has_verification !== 'true' && params.has_verification !== 'false') {
        errors.push('Invalid has_verification value (must be boolean)');
    }

    if (params.under_10_applicants !== undefined && typeof params.under_10_applicants !== 'boolean' && params.under_10_applicants !== 'true' && params.under_10_applicants !== 'false') {
        errors.push('Invalid under_10_applicants value (must be boolean)');
    }

    return errors;
};

module.exports = { validateSearchParams };