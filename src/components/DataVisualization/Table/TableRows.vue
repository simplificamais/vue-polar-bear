<template>
  <div
    class="table-rows pb-scroll-primary"
    :style="`${maxHeight ? `max-height: ${maxHeight}` : ''}`"
  >
    <div
      v-if="rows.length < 1"
      class="empty-title"
    >
      <p
        class="pb"
        style="color: var(--color-gray-20);"
      >
        Sem registros
      </p>
    </div>
    <div
      v-for="(row, index) in rows"
      :key="index"
      class="line"
      :class="{
        'row-highlight': highlightOnHover,
        'row-expanded': expandedRows.includes(index),
      }"
    >
      <div
        class="table-row pb-row"
        style="align-items: center;"
      >
        <div
          v-for="(column, columnIndex) in row"
          v-show="!hiddenColumnsIndex.includes(columnIndex)"
          :key="`column-${index}-${columnIndex}`"
          style="min-height: 60px;"
          :class="columnClasses(header[columnIndex].size, columnIndex)"
        >
          <div class="table-column">
            <img
              v-if="isImage(column.value)"
              :src="column.value"
              class="image"
            >

            <div v-else-if="isArray(column.value)">
              <div v-if="column.value.length > 0" class="items-list">
                <div
                  v-for="(item, arrayIndex) in column.value"
                  :key="arrayIndex"
                >
                  <p
                    v-if="
                      state.seeMoreInfo[index]
                        ? arrayIndex < column.value.length
                        : arrayIndex < 2
                    "
                    class="pb-md"
                  >
                    {{ item }}
                  </p>
                </div>
              </div>
              <p
                v-else
                class="pb-md"
              >
                Sem registros
              </p>
              <PbButton
                v-if="column.value.length > 2"
                class="see-more-info-button"
                color="primary"
                button-style="default"
                @click.native="seeMoreInfo(index)"
              >
                <span class="pb-md">{{
                  "Ver" + (state.seeMoreInfo[index] ? " menos" : " mais")
                }}</span>
              </PbButton>
            </div>

            <div v-else>
              <PbHint
                :hint-text="column.value"
                :disabled="!ellipsisOnOverflow"
                :show-on-overflow-only="true"
                position="bottom-right"
              >
                <p :class="ellipsisClass">
                  {{ column.value }}
                </p>
              </PbHint>

              <PbHint
                v-if="column.secondaryValue"
                :hint-text="column.secondaryValue"
                :disabled="!ellipsisOnOverflow"
                :show-on-overflow-only="true"
                position="bottom-right"
              >
                <p class="pb-sm secondary-value" :class="{ 'ellipsis-on-overflow': ellipsisOnOverflow }">
                  {{ column.secondaryValue }}
                </p>
              </PbHint>
            </div>

            <div
              v-if="column.badges"
              class="badges"
            >
              <PbBadge
                v-for="(badge, badgeIndex) of column.badges"
                :key="`badge-${index}-${columnIndex}-${badgeIndex}`"
                :title="badge.value"
                :wrap-content="true"
                :background-color="badge.backgroundColor"
                :color="badge.fontColor"
                style="margin-right: 2px;"
                :size="badge.size"
              />
            </div>
          </div>
        </div>

        <div
          v-if="hasActionColumn && !hiddenColumnsIndex.includes('action')"
          :class="columnClasses(actionsSize)"
          style="min-height: 60px;"
          :style="{
            order: 1000,
          }"
        >
          <div class="column">
            <slot
              name="actions"
              :row="row"
              :metadata="metadata[index]"
            />
          </div>
        </div>
        <div
          v-if="showExpandIcon"
          :class="expandIconClass"
          :style="{
            order: 1001,
          }"
        >
          <div class="table-column align-left">
            <PbIcon
              class="expand-icon"
              :icon="expandIcon(index)"
              :style="`color: var(--color-primary);`"
              @click="updateExpandedRows(index)"
            />
          </div>
        </div>
      </div>
      <div v-if="expandedRows.includes(index)">
        <div class="table-row pb-row">
          <div
            v-for="(column, columnIndex) in row"
            v-show="hiddenColumnsIndex.includes(columnIndex)"
            :key="columnIndex"
            class="pb-col-12"
          >
            <div class="table-column">
              <small class="pb">{{ header[columnIndex].label }}</small>
              <img
                v-if="isImage(column.value)"
                :src="column.value"
                class="image"
              >

              <div v-else-if="isArray(column.value)">
                <div v-if="column.value.length > 0" class="items-list">
                  <div
                    v-for="(item, arrayIndex) in column.value"
                    :key="arrayIndex"
                  >
                    <p
                      v-if="
                        state.seeMoreInfo[index]
                          ? arrayIndex < column.value.length
                          : arrayIndex < 2
                      "
                      class="pb-md"
                    >
                      {{ item }}
                    </p>
                  </div>
                </div>
                <p
                  v-else
                  class="pb-md"
                >
                  Sem registros
                </p>
                <PbButton
                  v-if="column.value.length > 2"
                  class="see-more-info-button"
                  color="primary"
                  button-style="default"
                  @click.native="seeMoreInfo(index)"
                >
                  <span class="pb-md">{{
                    "Ver" + (state.seeMoreInfo[index] ? " menos" : " mais")
                  }}</span>
                </PbButton>
              </div>

              <div v-else>
                <PbHint
                  :hint-text="column.value"
                  :disabled="!ellipsisOnOverflow"
                  :show-on-overflow-only="true"
                  position="bottom-right"
                >
                  <p :class="ellipsisClass">
                    {{ column.value }}
                  </p>
                </PbHint>

                <PbHint
                  v-if="column.secondaryValue"
                  :hint-text="column.secondaryValue"
                  :disabled="!ellipsisOnOverflow"
                  :show-on-overflow-only="true"
                  position="bottom-right"
                >
                  <p class="pb-sm secondary-value" :class="{ 'ellipsis-on-overflow': ellipsisOnOverflow }">
                    {{ column.secondaryValue }}
                  </p>
                </PbHint>
              </div>

              <div>
                <PbBadge
                  v-for="(badge, badgeIndex) of column.badges"
                  :key="`badge-${columnIndex}-${badgeIndex}`"
                  :title="badge.value"
                  :wrap-content="true"
                  :background-color="badge.backgroundColor"
                  :color="badge.fontColor"
                  style="margin-right: 2px;"
                  :size="badge.size"
                />
              </div>
            </div>
          </div>

          <div
            v-if="hasActionColumn && hiddenColumnsIndex.includes('action')"
          >
            <div class="table-column">
              <small class="pb">Ações</small>
              <slot
                name="actions"
                :row="row"
                :metadata="metadata[index]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isImage } from 'adapcon-utils-js';
import PbHint from '../../Miscellaneous/Hint/Hint.vue';
import PbBadge from '../../Miscellaneous/Badge/Badge.vue';
import PbIcon from '../../Miscellaneous/Icon/Icon';
import PbButton from '../../Buttons/Button/Button.vue';

export default {
  name: 'TableRows',

  components: {
    PbHint,
    PbBadge,
    PbIcon,
    PbButton,
  },

  props: {
    header: { type: Array, default: () => [] },
    rows: { type: Array, default: () => [] },
    metadata: { type: Array, default: () => [] },
    ellipsisOnOverflow: { type: Boolean, default: true },
    highlightOnHover: { type: Boolean, default: true },
    hasActionColumn: { type: Boolean, default: true },
    maxHeight: { type: String, default: '' },
    actionsSize: { type: Number, default: 1 },
    expandedRows: { type: Array, default: () => [] },
    hiddenColumnsIndex: { type: Array, default: () => [] },
    columnClasses: { type: Function, required: true },
    expandRowsColumnSize: { type: Number, default: 1 },
    expandAll: { type: Boolean, default: false },
  },

  data() {
    return {
      state: {
        seeMoreInfo: {},
      },
    };
  },

  computed: {
    expandIconClass() {
      return `pb-col-${this.expandRowsColumnSize}`;
    },

    internalExpandedRows: {
      get() {
        return this.expandedRows;
      },

      set(newValue) {
        this.$emit('update:expandedRows', newValue);
      },
    },

    showExpandIcon() {
      return this.hiddenColumnsIndex.length;
    },

    ellipsisClass() {
      return this.ellipsisOnOverflow ? 'pb-md ellipsis-on-overflow' : 'pb-md';
    },
  },

  watch: {
    expandAll: {
      handler(newValue) {
        this.internalExpandedRows = newValue
          ? this.rows.map((_, index) => index)
          : [];
      },
    },
  },

  methods: {
    isImage,

    isArray(value) {
      return Array.isArray(value);
    },

    seeMoreInfo(id) {
      this.$set(this.state.seeMoreInfo, id, !this.state.seeMoreInfo[id]);
    },

    setOffset() {
      this.$emit('offset', this.currentPage * this.pageLimit);
    },

    expandIcon(index) {
      return this.expandedRows.includes(index)
        ? 'fas fa-chevron-up'
        : 'fas fa-chevron-up fa-rotate-180';
    },

    updateExpandedRows(index) {
      const expandRow = !this.expandedRows.includes(index);

      this.internalExpandedRows = expandRow
        ? [...this.expandedRows, index]
        : this.expandedRows.filter(i => i !== index);
    },
  },
};
</script>

<style lang="scss" scoped>
.line {
  border-bottom: 1px solid #d6dbe0;
}

.table-rows {
  overflow: auto;

  .empty-title {
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      padding: 16px;
    }
  }

  .row-highlight > :hover {
    background-color: var(--color-gray);
    transition: 0.5s;
  }

  .row-expanded {
    background-color: var(--color-gray);
  }

  .table-row {
    display: flex;

    .table-column {
      padding: 8px;
      min-height: calc(60px - 16px);
      display: flex;
      flex-direction: column;
      justify-content: center;

      .items-list {
        padding: 8px 0;
      }
      .see-more-info-button {
        &::v-deep {
          margin: 0;
          padding: 0 !important;
          height: 20px !important;
        }
      }

      .badges {
        text-transform: uppercase;
      }

      small {
        color: var(--color-gray-90);
        margin-bottom: 8px !important;
      }
      .ellipsis-on-overflow {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .image {
        height: 24px;
        width: 24px;
      }

      .secondary-value {
        color: var(--color-gray-40);
        margin-top: 8px !important;
      }

      .expand-icon {
        cursor: pointer;
        transition: transform 0.2s;

        &:active {
          transform: scale(1);
        }
      }
    }

    .align-left {
      display: flex;
      align-items: end;
    }
  }
}
</style>
