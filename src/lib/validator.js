class RegexValidator {
	constructor(regex, error) {
		this.regex = regex
		this.error = error
	}

	validate(input) {
		if (this.regex.test(input)) {
			return { error: null, value: input }
		}
		return { error: this.error, value: null }
	}
}

module.exports = {
	hexString: new RegexValidator(/^0x[0-9a-f]+$/, new Error('must be a lowercase hex string'))
}
