import Joi from 'joi';

export const repositoryArgsSchema = Joi.object({
    userName: Joi.string().min(1).max(100).required().messages({
        'string.base': 'Owner should be a string.',
        'string.empty': 'Owner cannot be empty.',
        'string.min': 'Owner should have at least 1 character.',
    }),
    repoName: Joi.string().min(1).max(100).required().messages({
        'string.base': 'Repo should be a string.',
        'string.empty': 'Repo cannot be empty.',
        'string.min': 'Repo should have at least 1 character.',
    }),
});
