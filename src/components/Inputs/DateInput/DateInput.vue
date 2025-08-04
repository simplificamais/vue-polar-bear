<template>
  <div
    class="pb-date-input-container"
  >
    <input
      v-model="typeInputValidation"
      class="pb"
      :type="state.typeInput"
      :placeholder="placeholder"
      :style="inputStyle"
      :class="{
        'input-error': !state.validation,
        'white-calendar': color === 'white'
      }"
      @click="changeTypeInput()"
    >
  </div>
</template>

<script>
import { validateColor } from '@pb/utils/validator';

export default {
  name: 'PbDateInput',
  props: {
    value: { type: [String, Date], default: '' },
    placeholder: { type: String, default: '' },
    onValidate: { type: Function, default: null },
    timeOutValue: { type: Number, default: 1000 },
    color: {
      type: String,
      default: 'gray-20',
      validator: color => validateColor(color),
    },
  },

  data() {
    return {
      state: {
        dateObj: new Date(),
        typeInput: this.placeholder === '' ? 'date' : 'text',
        validation: true,
        changeDate: null,
      },
    };
  },
  computed: {
    inputDate: {
      get() {
        if (typeof this.value === 'string' && this.value !== '')
          return this.value;

        return this.value ? this.dateToString(this.value) : this.dateToString(new Date());
      },
      set(date) {
        if (!date) {
          this.state.validation = false;
          return;
        }

        this.state.dateObj = new Date(date);
        this.state.dateObj.setHours(this.state.dateObj.getHours() + (this.state.dateObj.getTimezoneOffset() / 60));

        if (this.state.changeDate)
          clearTimeout(this.state.changeDate);

        this.state.changeDate = setTimeout(() => {
          clearTimeout(this.state.changeDate);

          this.validate(this.state.dateObj);

          this.$emit('input', this.state.dateObj);

          this.$emit('validation', {
            validation: this.state.validation,
          });
        }, this.timeOutValue);
      },
    },

    typeInputValidation: {
      get() {
        return this.state.typeInput !== 'date' ? this.placeholder : this.inputDate;
      },

      set(newValue) {
        if (newValue)
          this.inputDate = newValue;
      },
    },

    inputStyle() {
      return {
        color: `var(--color-${this.color})`,
        border: `1px solid var(--color-${this.color})`,
      };
    },
  },

  methods: {
    changeTypeInput() {
      if (this.state.changeDate)
        clearTimeout(this.state.changeDate);

      this.state.changeDate = setTimeout(() => {
        clearTimeout(this.state.changeDate);

        this.validate(this.state.dateObj);

        this.$emit('input', this.state.dateObj);

        this.$emit('validation', {
          validation: this.state.validation,
        });
      }, this.timeOutValue);
      this.state.typeInput = 'date';
    },

    validate(date) {
      let validation = true;
      if (!this.isValidDate(date))
        validation = false;
      else if (typeof this.onValidate === 'function')
        validation = this.onValidate(date);

      this.state.validation = validation;
    },

    dateToString(date) {
      return date.toISOString().split('T')[0];
    },

    isValidDate(date) {
      if (Object.prototype.toString.call(date) === '[object Date]') {
        if (!Number.isNaN(date.getTime()))
          return true;
      }
      return false;
    },
  },
};
</script>

<style lang='scss' scoped>
.pb-date-input-container {
  display: flex;
  flex-direction: column;

  input {
    width: 100%;
    height: 40px;
    border-radius: 20px;
    transition: all 0.3s ease;
    background: none;

    &:focus {
      border: 1px solid var(--color-gray-90) !important;
    }

    &.input-error {
      border-color: var(--color-danger) !important;
    }

    &::-webkit-calendar-picker-indicator:hover {
      cursor: pointer;
    }

    &.white-calendar {
      &::-webkit-calendar-picker-indicator {
        filter: invert(1);
      }
    }
  }
}
</style>
