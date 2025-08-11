<template>
  <button
    :class="buttonClasses"
    :style="`${buttonHeight} ${buttonColor} ${buttonRadius}`"
    :disabled="disabled || loading"
  >
    <div
      class="pb-button-container"
      :style="`flex-direction: ${iconPosition === 'right' ? 'row-reverse' : 'row'};`"
    >
      <PbIcon
        v-if="icon"
        :class="iconClass"
        style="transition: all .3s ease"
        :style="iconMargin"
        :icon="buttonIcon"
      />
      <p
        v-if="label"
        :class="labelClass"
        :style="!icon && loading ? 'animation: opacity-blink 2s infinite;' : ''"
      >
        {{ label }}
      </p>
      <slot />
      <abbr
        v-if="hasNotificationBadge"
        class="pb-button-notification-badge pb-button-text-color-white"
        :class="{
          'pb-button-notification-badge-top-left': notificationBadgePosition === 'top-left',
          'pb-button-notification-badge-bottom-left': notificationBadgePosition === 'bottom-left',
          'pb-button-notification-badge-bottom-right': notificationBadgePosition === 'bottom-right',
        }"
        :style="{ 'background-color': notificationBadgeColor }"
      >
        {{ notificationBadgeValue }}
      </abbr>
    </div>
  </button>
</template>

<script>
import PbIcon from '@pb/Miscellaneous/Icon/Icon';
import { validateColor } from '@pb/utils/validator';
import { buttonStyles } from '@pb/utils/constants';

export default {
  name: 'PbButton',
  components: {
    PbIcon,
  },
  props: {
    // Regular Props
    color: {
      type: String,
      default: 'primary',
      validator: color => validateColor(color),
    },

    buttonStyle: {
      type: String,
      default: 'regular',
      validator: style => buttonStyles.includes(style),
    },

    buttonSize: {
      type: String,
      default: 'large',
      validator: style => [
        'small',
        'medium',
        'large',
      ].includes(style),
    },

    radius: {
      type: String,
      default: '20px',
    },

    disableHover: {
      type: Boolean,
      default: false,
    },

    label: { type: String, default: '' },

    disabled: { type: Boolean, default: false },

    loading: { type: Boolean, default: false },

    // Icon Props
    icon: { type: String, default: '' },
    iconPosition: {
      type: String,
      default: 'left',
      validator: position => [
        'left',
        'right',
      ].includes(position),
    },

    // Notification Badge Props
    notificationBadge: { type: Boolean, default: false },
    notificationBadgePosition: {
      type: String,
      default: 'top-right',
      validator: position => [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ].includes(position),
    },
    notificationBadgeValue: { type: [String, Number], default: '' },
    notificationBadgeColor: { type: String, default: '#ff7614' },

  },
  computed: {
    buttonIcon() {
      if (this.loading)
        return 'fas fa-spinner fa-spin';
      return this.icon;
    },

    hasNotificationBadge() {
      return this.notificationBadge
        || this.notificationBadgeValue;
    },

    buttonClasses() {
      return {
        'pb-button': true,
        'pb-button-style-regular': this.buttonStyle === 'regular' && !this.disableHover,
        'pb-button-style-regular-no-hover': this.buttonStyle === 'regular' && this.disableHover,
        'pb-button-style-outline': this.buttonStyle === 'outline',
        'pb-button-style-background': this.buttonStyle === 'background',
        'pb-button-icon-only': this.isIconOnly,
      };
    },

    buttonHeight() {
      switch (this.buttonSize) {
        case 'small':
          return this.isIconOnly ? 'height: 24px; width: 24px;' : '';
        case 'medium':
          return this.isIconOnly ? 'height: 32px; width: 32px;' : 'height: 32px; padding: 12px;';
        default:
          return 'height: 40px; padding: 16px;';
      }
    },

    buttonColor() {
      const colorVar = this.color
        ? `var(--color-${this.color})`
        : 'var(--color-primary)';

      const color = getComputedStyle(document.documentElement).getPropertyValue(`--color-${this.color}`);
      const hexadecimalOpacity = '14'; // 8%

      switch (this.buttonStyle) {
        case 'outline':
          return `border-color: ${colorVar}; color: ${colorVar};`;
        case 'background':
          return `background-color: ${colorVar}; color: ${this.color === 'white' ? 'var(--color-primary)' : 'white'};`;
        case 'background-light':
          return `background-color: ${color}${hexadecimalOpacity};  color: ${colorVar};`;
        default:
          return `color: ${colorVar};`;
      }
    },

    buttonRadius() {
      return `border-radius: ${this.radius};`;
    },

    labelClass() {
      switch (this.buttonSize) {
        case 'medium':
          return 'pb-sm-strong';
        default:
          return 'pb-strong';
      }
    },

    iconClass() {
      switch (this.buttonSize) {
        case 'small':
          return 'fa-sm';
        case 'medium':
          return 'fa-sm';
        default:
          return 'fa';
      }
    },

    iconMargin() {
      if (this.isIconOnly) return '';

      const iconMargin = this.buttonSize === 'medium' ? '6px' : '8px';

      return this.iconPosition === 'left' ? `margin-right: ${iconMargin};` : `margin-left: ${iconMargin};`;
    },

    isIconOnly() {
      return !this.$slots.default && !this.label && this.icon;
    },
  },
};
</script>

<style lang="scss" scoped>
.pb-button {
  font-size: 14px !important;
  font-weight: 600 !important;
  text-transform: unset !important;
  border: none;
  background: none;
  outline: none;
  user-select: none;
  transition: all 0.3s ease;
  margin: 5px;
  white-space: nowrap;
  position: relative;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.pb-button-style-regular {
    padding: 0 !important;
    height: auto;
    &:hover {
      color: var(--color-primary) !important;
    }
  }
  &.pb-button-style-regular-no-hover {
    padding: 0 !important;
    height: auto;
  }
  &.pb-button-style-outline {
    border: 1px solid;
  }
  &.pb-button-icon-only {
    padding: 0;
    width: 40px;
  }

  .pb-button-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pb-button-notification-badge {
    position: absolute;
    top: -2px;
    right: -6px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    overflow: hidden;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pb-button-notification-badge-top-left {
    top: -2px;
    left: -6px;
  }
  .pb-button-notification-badge-bottom-left {
    top: inherit;
    bottom: -2px;
    left: -6px;
  }
  .pb-button-notification-badge-bottom-right {
    top: inherit;
    bottom: -2px;
    right: -6px;
  }
}

</style>
