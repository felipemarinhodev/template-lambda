const Joi = require('@hapi/joi');
const decoratorValidator = require('./util/decoratorValidator');
const globalEnum = require('./util/globalEnum');

class Handler {
	constructor() {}

	static validator() {
		return Joi.object({
			name: Joi.string().max(100).min(4).required(),
			rule: Joi.string().max(50).required(),
		})
	}

	/**
	 * Função responsável por executar o objetivo do lambda. Caso seja realizar um insert na base, chamar outro serviço, ou etc.
	 * @param {*} params 
	 */
	async execute(params) {
		return params;
	}

	/**
	 * Função responsável por manipular os dados. Ex: adicionar um id, ou data de criação/atualização
	 * @param {any} data 
	 */
	prepareData(data) {
		const params = {
			...data,
			createdAt: new Date().toISOString()
		}
		return params
	}

	handlerSuccess(data) {
		const response = {
			statusCode: 200,
			body: JSON.stringify(data)
		}
		return response
	}

	handlerError(data) {
		return {
			statusCode: data.statusCode || 501,
			headers: { 'Content-Type': 'text/plain' },
			body: 'Não foi possível executar o Lambda.'
		}
	}

	async main(event) {
		try {
			const data = event.body
			const dbParams = this.prepareData(data);
			await this.execute(dbParams)
			return this.handlerSuccess(dbParams)
		} catch (error) {
			console.error('Deu ruim**', error.stack);
			return this.handlerError({ statusCode: 500 })
		}
	}
}

const handler = new Handler()
module.exports = decoratorValidator(
	handler.main.bind(handler),
	Handler.validator(),
	globalEnum.ARG_TYPE.BODY
	);