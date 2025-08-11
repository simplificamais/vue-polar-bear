<template>
  <div class="pb-checkbox-circle-container">
    <div
      class="check-box"
      :class="getCheckboxClass()"
      @click="() => (checked = !checked)"
      :style="`border: 1px solid ${getColor()};`"
    >
      <transition name="scale">
        <div
          v-if="checked"
          class="checked"
          :style="`background-color: ${getColor()};`"
        >
          <PbIcon
            icon="fa fa-check"
            :style="`color: ${getIconColor()};`"
            class="icon"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import PbIcon from '@pb/Miscellaneous/Icon/Icon';
import { validateColor } from '@pb/utils/validator';

export default {
  name: 'PbCheckboxCircle',
  components: {
    PbIcon,
  },
  props: {
    value: { type: Boolean, default: false },
    color: {
      type: String,
      default: 'primary',
      validator: color => validateColor(color),
    },
    hexColor: {
      type: String,
      default: '',
    },
    checkedIconColor: {
      type: String,
      default: 'white',
    },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    checked: {
      get() {
        return this.value;
      },
      set(val) {
        if (this.disabled) return;

        this.$emit('input', val);
      },
    },
  },

  methods: {
    getCheckboxClass() {
      return this.disabled ? 'check-box-disabled' : '';
    },

    getColor() {
      if (this.disabled) return 'var(--color-gray-20)';

      return this.hexColor ? this.hexColor : `var(--color-${this.color})`;
    },

    getIconColor() {
      return `var(--color-${this.checkedIconColor})`;
    },
  },
};
</script>

<style lang="scss" scoped>
.pb-checkbox-circle-container {
  display: flex;
  
  .check-box {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    cursor: pointer;

    &.check-box-disabled {
      cursor: not-allowed;
      background-color: #E2E5E8;
      border: 1px solid #B2B6B9;
    }

    .checked {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;

      .icon {
        max-width: 8px;
        max-height: 9px;
      }
    }
  }

  .scale-enter-active, .scale-leave-active {
    transition: .2s;
  }
  .scale-enter, .scale-leave-to {
    transform: scale(0);
  }
}
</style>
