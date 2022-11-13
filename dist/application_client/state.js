"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeState = void 0;
function strOrHex(v) {
    try {
        return v.toString('utf-8');
    }
    catch (e) {
        return v.toString('hex');
    }
}
// Converts an array of global-state or global-state-deltas to a more
// friendly generic object
function decodeState(state, raw) {
    const obj = {};
    // Start with empty set
    for (const stateVal of state) {
        const keyBuff = Buffer.from(stateVal.key, 'base64');
        const key = raw ? keyBuff.toString('hex') : strOrHex(keyBuff);
        const value = stateVal.value;
        // In both global-state and state deltas, 1 is bytes and 2 is int
        const dataTypeFlag = value.action ? value.action : value.type;
        switch (dataTypeFlag) {
            case 1:
                const valBuff = Buffer.from(value.bytes, 'base64');
                obj[key] = raw ? new Uint8Array(valBuff) : strOrHex(valBuff);
                break;
            case 2:
                obj[key] = value.uint;
                break;
            default: // ??
        }
    }
    return obj;
}
exports.decodeState = decodeState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwbGljYXRpb25fY2xpZW50L3N0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQW1CQSxTQUFTLFFBQVEsQ0FBQyxDQUFTO0lBQ3pCLElBQUk7UUFDRixPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDNUI7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxQjtBQUNILENBQUM7QUFFRCxxRUFBcUU7QUFDckUsMEJBQTBCO0FBQzFCLFNBQWdCLFdBQVcsQ0FBQyxLQUFtQixFQUFFLEdBQWE7SUFDNUQsTUFBTSxHQUFHLEdBQUcsRUFBVyxDQUFDO0lBRXhCLHVCQUF1QjtJQUN2QixLQUFLLE1BQU0sUUFBUSxJQUFJLEtBQUssRUFBRTtRQUM1QixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDcEQsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztRQUU3QixpRUFBaUU7UUFDakUsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUM5RCxRQUFRLFlBQVksRUFBRTtZQUNwQixLQUFLLENBQUM7Z0JBQ0osTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNuRCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM3RCxNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO2dCQUN0QixNQUFNO1lBQ1IsUUFBUSxDQUFDLEtBQUs7U0FDZjtLQUNGO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBeEJELGtDQXdCQyJ9