"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitTask = exports.submitTask_ERRORS = exports.assignTask = exports.AssigneType = exports.getTask = exports.getActiveState = exports.getStatus = exports.getElementById = exports.getNextElement = exports.decide = void 0;
var Sqrl = require("squirrelly");
var STEP_TYPE;
(function (STEP_TYPE) {
    STEP_TYPE["assign"] = "assign";
    STEP_TYPE["submit"] = "submit";
})(STEP_TYPE || (STEP_TYPE = {}));
function decide(expr, state) {
    try {
        var result = Sqrl.render(expr, state);
        return result === "true";
    }
    catch (error) {
        return false;
    }
}
exports.decide = decide;
function getNextElement(state, connectors, currentElementId) {
    var _a;
    var candidates = connectors.filter(function (c) { return c.start === currentElementId; });
    var candidate = candidates.find(function (c) {
        if (c.condition) {
            return decide(c.condition, { state: state });
        }
        return false;
    });
    if (candidate) {
        return candidate.end;
    }
    return (_a = candidates.find(function (c) { return !c.condition; })) === null || _a === void 0 ? void 0 : _a.end;
}
exports.getNextElement = getNextElement;
function getElementById(jsmd, id) {
    return jsmd.elements.find(function (element) { return element.id === id; });
}
exports.getElementById = getElementById;
function getStatus(jsmd, activeElementId) {
    if (jsmd.steps.filter(function (s) { return s.type === "submit"; }).length === 0) {
        return "draft";
    }
    if (activeElementId) {
        return getElementById(jsmd, activeElementId).flowStatus || "processing";
    }
    return "completed";
}
exports.getStatus = getStatus;
function getActiveState(jsmd) {
    var submits = jsmd.steps.filter(function (s) { return s.type === STEP_TYPE.submit; });
    var state = submits.reduce(function (total, current, i) {
        total.state[total.activeElementId] = { data: current.data, action: current.action };
        var next = getNextElement(total.state, jsmd.connectors, total.activeElementId);
        return { state: total.state, activeElementId: next };
    }, { state: {}, activeElementId: jsmd.elements[0].id });
    var status = getStatus(jsmd, state.activeElementId);
    return __assign(__assign({}, state), { status: status });
}
exports.getActiveState = getActiveState;
function getTask(jsmd) {
    var activeState = getActiveState(jsmd);
    if (!activeState.activeElementId) {
        return null;
    }
    var id = jsmd.steps.filter(function (s) { return s.type !== STEP_TYPE.assign; }).length;
    var assigns = jsmd.steps.filter(function (s) { return s.type === STEP_TYPE.assign; });
    var assignee = jsmd.steps.reduce(function (prev, current, i) {
        var _a;
        if (current.type === STEP_TYPE.submit) {
            return null;
        }
        return (_a = current === null || current === void 0 ? void 0 : current.data) === null || _a === void 0 ? void 0 : _a.id;
    }, null);
    return { id: id, assignee: assignee, state: activeState.state, element: getElementById(jsmd, activeState.activeElementId) };
}
exports.getTask = getTask;
var AssigneType;
(function (AssigneType) {
    AssigneType["permission"] = "permission";
})(AssigneType = exports.AssigneType || (exports.AssigneType = {}));
function assignTask(jsmd, user, taskIndex, assignee) {
    var flow = JSON.parse(JSON.stringify(jsmd));
    var steps = flow.steps;
    flow.steps = __spreadArray(__spreadArray([], steps), [{ action: STEP_TYPE.assign, userId: user.id, type: STEP_TYPE.assign, data: { id: assignee.id } }]);
    return flow;
}
exports.assignTask = assignTask;
var submitTask_ERRORS;
(function (submitTask_ERRORS) {
    submitTask_ERRORS["FLOW_IS_OVER"] = "flow is over";
    submitTask_ERRORS["TASK_IS_OVER"] = "task is over";
    submitTask_ERRORS["WRONG_ASSIGNEE"] = "wrong assignee";
})(submitTask_ERRORS = exports.submitTask_ERRORS || (exports.submitTask_ERRORS = {}));
function submitTask(jsmd, userId, taskId, data, action) {
    var _currentTask = getTask(jsmd);
    if (!_currentTask) {
        return submitTask_ERRORS.FLOW_IS_OVER;
    }
    var currentTask = _currentTask;
    if (currentTask.id !== taskId) {
        return submitTask_ERRORS.TASK_IS_OVER;
    }
    if (userId !== currentTask.assignee) {
        return submitTask_ERRORS.WRONG_ASSIGNEE;
    }
    var flow = JSON.parse(JSON.stringify(jsmd));
    var steps = flow.steps;
    flow.steps = __spreadArray(__spreadArray([], steps), [{ userId: userId, type: STEP_TYPE.submit, data: data, action: action }]);
    return flow;
}
exports.submitTask = submitTask;
