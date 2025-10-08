<template>
  <div class="pb-phone-input-container">
    <input
      v-model="phoneInput"
      :class="inputTypeClass"
      :style="inputTypeStyle"
      class="pb"
      style="width: 100%;"
      placeholder="(__) _____ - ____"
      maxlength="19"
      :disabled="disabled"
      @blur="validatePhone"
      @focus="updateValidationFiled"
    >
    <p
      v-if="state.message"
      class="pb error-text"
    >
      {{ state.message }}
    </p>
  </div>
</template>

<script>
import { validateColor } from '@pb/utils/validator';
import { formatPhone } from 'adapcon-utils-js';

export default {
  name: 'PbPhoneInput',
  props: {
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    value: { type: String, default: '' },
    color: { type: String, default: 'gray-20', validator: color => validateColor(color) },
    background: { type: String, default: 'transparent' },
    validateDdi: { type: Boolean, default: false },

    inputStyle: {
      type: String,
      default: 'outline',
      validator: style => [
        'regular',
        'outline',
      ].includes(style),
    },
  },

  data() {
    return {
      state: {
        validation: true,
        message: '',
      },
    };
  },

  computed: {
    inputTypeStyle() {
      if (this.inputStyle === 'regular') return { background: `var(--color-${this.background})`, opacity: `${this.disabled ? '0.5' : '1'}` };
      return {
        ...(this.state.validation
          ? { background: `var(--color-${this.background})`, border: `1px solid var(--color-${this.color})`, opacity: `${this.disabled ? '0.5' : '1'}` }
          : { background: `var(--color-${this.background})`, opacity: `${this.disabled ? '0.5' : '1'}` }
        ),
      };
    },

    inputTypeClass() {
      const errorClass = this.inputStyle === 'regular' ? 'error' : 'error-outline';
      return !this.state.validation ? errorClass : '';
    },

    phoneInput: {
      get() {
        return formatPhone(this.value);
      },

      set(phone) {
        const formatPhoneValue = phone.replace(/[^\w\s]/gi, '').replace(/\s+/g, '').trim();
        this.$emit('input', formatPhoneValue);
        // this.validatePhone();
      },
    },
  },

  mounted() {
    if (this.state.phone)
      this.validatePhone();
  },

  methods: {
    validatePhone() {
      let errorMessage = '';
      const minimumLength = this.validateDdi ? 12 : 10;
      const rawNumber = this.phoneInput ? this.phoneInput.replace(/[^\d]/g, '') : '';

      if (this.required && (!this.phoneInput || this.phoneInput.length === 0))
        errorMessage = 'Este campo é obrigatório!';
      else if (rawNumber.length < minimumLength)
        errorMessage = `Este campo precisa ter no mínimo ${minimumLength} dígitos!`;

      this.updateValidationFiled({ message: errorMessage });
    },

    updateValidationFiled({ message }) {
      this.state.validation = !message;
      this.state.message = message || '';

      this.$emit('validation', {
        validation: this.state.validation,
        message: this.state.message,
      });
    },
  },

};
</script>

<style lang="scss" scoped>
  .pb-phone-input-container {

    .error {
      animation: shake 0.08s 3;
    }

    .error-outline {
      border: 1px solid var(--color-danger);
      animation: shake 0.08s 3;
    }

    .error-text {
      height: 16px;
      font-size: 12px !important;
      padding: 3px;
      color: var(--color-danger);
    }
  }
</style>
