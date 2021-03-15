// Data layer for index.vue
import {
  COLOUR,
  ICON_TYPE,
  FAB_ACTION,
  MODAL_VIEWS,
  ERROR_GROUP,
  ERROR_FREQUENCY_COLUMN
} from "../constants/enums";
import { resolvedErrorCountTooltip } from "../constants/data";
import { operator } from "../constants/mockData";
import { buttonAction } from "../utils/errorButtonAction";
import {
  actionHistory,
  undoAction,
  undoAllActions
} from "../utils/interactionManager";
import { notificationHistory } from "../utils/notificationManager";

export const componentDataLayer = {
  async asyncData({ $axios }) {
    try {
      const {
        resolved,
        unresolved,
        backlog
      } = await $axios.$get("http://localhost:8000/get_lists", {
        params: { name: `${operator.name} ${operator.surname}` }
      });
      return { resolved, unresolved, backlog };
    } catch (error) {
      console.log(
        `Couldn't get error lists:\n${error}\nDid you start the API?`
      );
      console.log(
        "HINT: You can comment out the full `asyncData` method and work with mocked data for UI/UX development, if you want to."
      );
    }
  },
  methods: {
    // Control toggle for modal state
    toggleModal: function(viewState = undefined) {
      this.modalState = !this.modalState;

      if (viewState === MODAL_VIEWS.ERROR_OCCURRENCES) {
        this.selectedModal = MODAL_VIEWS.ERROR_OCCURRENCES;
        this.requestErrorOccurrence = true;
      } else if (viewState === MODAL_VIEWS.NOTIFICATIONS) {
        this.selectedModal = MODAL_VIEWS.NOTIFICATIONS;
      } else {
        this.selectedModal = undefined;
        this.requestErrorOccurrence = false;
      }
    }
  },
  watch: {
    // Observe modal state change for triggering post request on counting error code occurrences.
    requestErrorOccurrence: async function(newState) {
      if (newState) {
        try {
          this.errorCount = await this.$axios.$post(
            "http://localhost:8000/count_resolved_error_code_occurrences",
            this.resolved
          );
        } catch (error) {
          console.log(
            `Couldn't get error code occurrences:\n${error}\nDid you start the API?`
          );
        }
      }
    }
  },
  data() {
    return {
      unresolved: [],
      resolved: [],
      backlog: [],
      buttonAction,
      undoAction,
      undoAllActions,
      actionHistory,
      notificationHistory,
      selectedModal: undefined,
      modalState: false,
      requestErrorOccurrence: false,
      errorCount: [],
      resolvedErrorCountTooltip,
      COLOUR,
      ICON_TYPE,
      FAB_ACTION,
      MODAL_VIEWS,
      ERROR_GROUP,
      ERROR_FREQUENCY_COLUMN
    };
  }
};