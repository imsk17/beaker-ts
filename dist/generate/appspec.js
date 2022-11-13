"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStateSchema = exports.AVMType = void 0;
var AVMType;
(function (AVMType) {
    AVMType[AVMType["uint64"] = 0] = "uint64";
    AVMType[AVMType["bytes"] = 1] = "bytes";
})(AVMType = exports.AVMType || (exports.AVMType = {}));
function getStateSchema(s) {
    let uints = 0;
    let bytes = 0;
    for (const item of Object.entries(s.declared)) {
        if (item[1].type == AVMType.bytes)
            bytes += 1;
        if (item[1].type == AVMType.uint64)
            uints += 1;
    }
    for (const item of Object.entries(s.reserved)) {
        if (item[1].type == AVMType.bytes)
            bytes += item[1].max_keys;
        if (item[1].type == AVMType.uint64)
            uints += item[1].max_keys;
    }
    return { uints: uints, bytes: bytes };
}
exports.getStateSchema = getStateSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nZW5lcmF0ZS9hcHBzcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQXNDQSxJQUFZLE9BR1g7QUFIRCxXQUFZLE9BQU87SUFDakIseUNBQU0sQ0FBQTtJQUNOLHVDQUFLLENBQUE7QUFDUCxDQUFDLEVBSFcsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBR2xCO0FBd0JELFNBQWdCLGNBQWMsQ0FBQyxDQUFTO0lBQ3RDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNkLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUVkLEtBQUssTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDN0MsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLO1lBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQztRQUM5QyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLE1BQU07WUFBRSxLQUFLLElBQUksQ0FBQyxDQUFDO0tBQ2hEO0lBRUQsS0FBSyxNQUFNLElBQUksSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUM3QyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUs7WUFBRSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUM3RCxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLE1BQU07WUFBRSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztLQUMvRDtJQUVELE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUN4QyxDQUFDO0FBZkQsd0NBZUMifQ==