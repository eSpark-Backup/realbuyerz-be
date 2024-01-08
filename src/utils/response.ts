/* eslint-disable prettier/prettier */

   export function generateResponse(action, message, data,entity) {
        const response = {
            timestamp_ms: Date.now(),
            action: action,
            [entity]:data,
        };
        return { success: true, message: message, response };
    }

