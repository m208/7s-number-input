class NumberInput {
    constructor(selector, options) {
        this.$el = selector // document.querySelector(selector)
        this.options = options

        this.options.step = this.options.step || +this.$el.querySelector('input').dataset.step || 1
        this.options.min = this.options.min || +this.$el.querySelector('input').dataset.min || 1
        this.options.max = this.options.max || +this.$el.querySelector('input').dataset.max

        this.options.value = this.options.value || +this.$el.querySelector('input').value || ''

        this.options.placeholder = this.options.placeholder || ''
        this.options.style = `width: ${(this.options.isMobile) ? '50px' : this.options.width || '65px'}; 
                                height: ${this.options.height || '35px'}`

        this.options.integer = this.options.integer

        if (this.options.forceMinimal === undefined) this.options.forceMinimal = true

        if (this.options.integer === undefined) {
            if (this.$el.querySelector('input').dataset.integer) {
                this.options.integer = strToBool(this.$el.querySelector('input').dataset.integer)
            } else {
                this.options.integer = true
            }
        }

        this.render()
        this.setup()
    }


    render() {
        if (this.options.isMobile) {
            this.$el.innerHTML =
                `<div class="number_input_mobile">
                    <input type="button" value="-" class="plus_minus_input_mobile" data-type="dec">
                        <input type="text" name = "input" class="input_number_input" inputMode="numeric" pattern="[0&shy;9]*"
                            placeholder="${this.options.placeholder}"
                            value="${this.options.value}" style="${this.options.style}" 
                        >
                    <input type="button" value="+" class="plus_minus_input_mobile" data-type="inc">
                </div>`
        } else {
            this.$el.innerHTML =
                `<div class="number_input" style="${this.options.style}">
                    <input type="text" class="input_number_input" name = "input"
                        placeholder="${this.options.placeholder}" 
                        value="${this.options.value}" style="${this.options.style}"
                    >
                    <div class="plus_number_input" data-type="inc"></div>
                    <div class="minus_number_input" data-type="dec"></div>
                </div>`
        }
    }

    setup() {
        this.clickHandler = this.clickHandler.bind(this)
        this.$el.addEventListener('click', this.clickHandler)

        this.onTextChange = this.onTextChange.bind(this)
        this.$input = this.$el.querySelector('.input_number_input')
        this.$input.addEventListener('input', this.onTextChange)
    }

    onTextChange(event) {
        const currentValue = event.target.value
        let newVal = currentValue.replace(/[^0-9.,]/g, "");

        if (this.options.integer) { newVal = newVal.replace(/[.,]/g, "") }
        else { newVal = newVal.replace(/,/g, '.') }

        if (parseFloat(newVal) > this.options.max) newVal = this.options.max

        if (this.options.forceMinimal) {
            if (!newVal) newVal = this.options.min
            if (newVal[newVal.length - 1] !== '.' && parseFloat(newVal) < this.options.min) newVal = this.options.min
        }

        this.$input.value = newVal
        if (newVal >= this.options.min) this.options.onChange(newVal, this.$el.id)
    }

    clickHandler(event) {
        const { type } = event.target.dataset
        const currentValue = Number(this.$input.value)
        let newVal = currentValue
        if (type === 'inc') {
            newVal = Number((currentValue + this.options.step).toFixed(3))
            if (this.options.max && currentValue + this.options.step >= this.options.max) {
                newVal = this.options.max
            }
            if (currentValue + this.options.step <= this.options.min) {
                newVal = this.options.min
            }
        } else if (type === 'dec') {
            newVal = Number((currentValue - this.options.step).toFixed(3))
            if (currentValue - this.options.step <= this.options.min) {
                newVal = this.options.min
            }
        }
        if (newVal !== currentValue) {
            this.$input.value = newVal
            this.options.onChange(newVal, this.$el.id)
        }
    }
}


function strToBool(string) {
    if (string === "false") return false
    else return true
}