"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTask = exports.submitTask = exports.assignTask = exports.start = exports.Flow = exports.Step = void 0;
var typeorm_1 = require("typeorm");
var JSMD_1 = require("../JSMD");
var Step = /** @class */ (function () {
    function Step() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", String)
    ], Step.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Step.prototype, "type", void 0);
    __decorate([
        typeorm_1.Column({ type: "json" }),
        __metadata("design:type", Object)
    ], Step.prototype, "data", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Step.prototype, "action", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Step.prototype, "userId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Flow; }, function (flow) { return flow.steps; }),
        __metadata("design:type", Flow)
    ], Step.prototype, "flow", void 0);
    Step = __decorate([
        typeorm_1.Entity()
    ], Step);
    return Step;
}());
exports.Step = Step;
var Flow = /** @class */ (function () {
    function Flow() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", String)
    ], Flow.prototype, "id", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Step; }, function (step) { return step.flow; }),
        __metadata("design:type", Array)
    ], Flow.prototype, "steps", void 0);
    __decorate([
        typeorm_1.Column({ type: "json" }),
        __metadata("design:type", Array)
    ], Flow.prototype, "elements", void 0);
    __decorate([
        typeorm_1.Column({ type: "json" }),
        __metadata("design:type", Array)
    ], Flow.prototype, "connectors", void 0);
    __decorate([
        typeorm_1.Column({ type: "json" }),
        __metadata("design:type", Object)
    ], Flow.prototype, "status", void 0);
    Flow = __decorate([
        typeorm_1.Entity()
    ], Flow);
    return Flow;
}());
exports.Flow = Flow;
function start(jsmd, appUser, action, data) {
    return __awaiter(this, void 0, void 0, function () {
        var flow, _startedFlow, startedFlow, steps, newFlow;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flow = JSMD_1.assignTask(jsmd, appUser, 0, appUser);
                    if (!(typeof flow === "string")) return [3 /*break*/, 1];
                    return [2 /*return*/, flow];
                case 1:
                    _startedFlow = JSMD_1.submitTask(flow, appUser.id, 0, data, action);
                    if (typeof _startedFlow === "string") {
                        return [2 /*return*/, _startedFlow];
                    }
                    startedFlow = _startedFlow;
                    return [4 /*yield*/, Promise.all(_startedFlow.steps.map(function (s) {
                        return __awaiter(_this, void 0, void 0, function () {
                            var step;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        step = new Step();
                                        step.action = s.action;
                                        step.data = s.data;
                                        step.type = s.type;
                                        step.userId = s.userId;
                                        return [4 /*yield*/, typeorm_1.getRepository(Step).save(step)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, step];
                                }
                            });
                        });
                    }))];
                case 2:
                    steps = _a.sent();
                    newFlow = new Flow();
                    newFlow.steps = steps;
                    newFlow.connectors = startedFlow.connectors;
                    newFlow.elements = startedFlow.elements;
                    newFlow.status = JSMD_1.getActiveState(startedFlow);
                    return [4 /*yield*/, typeorm_1.getRepository(Flow).save(newFlow)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, newFlow];
            }
        });
    });
}
exports.start = start;
function assignTask(flowId, user, taskIndex, assignee) {
    return __awaiter(this, void 0, void 0, function () {
        var flow, assignedFlow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, typeorm_1.getRepository(Flow).findOne(flowId, { relations: ["steps"] })];
                case 1:
                    flow = _a.sent();
                    if (!flow) {
                        return [2 /*return*/, "n.a."];
                    }
                    assignedFlow = JSMD_1.assignTask(flow, user, taskIndex, assignee);
                    if (typeof assignedFlow === "string") {
                        return [2 /*return*/, assignedFlow];
                    }
                    return [4 /*yield*/, saveNewStep(assignedFlow, flow)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.assignTask = assignTask;
function saveNewStep(jsmd, flow) {
    return __awaiter(this, void 0, void 0, function () {
        var jnewStep, newStep, newFlow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jnewStep = jsmd.steps[jsmd.steps.length - 1];
                    newStep = new Step();
                    newStep.action = jnewStep.action;
                    newStep.data = jnewStep.data;
                    newStep.flow = flow;
                    newStep.type = jnewStep.type;
                    newStep.userId = jnewStep.userId;
                    return [4 /*yield*/, typeorm_1.getRepository(Step).save(newStep)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, typeorm_1.getRepository(Flow).findOne(flow.id, { relations: ["steps"] })];
                case 2:
                    newFlow = _a.sent();
                    newFlow.status = JSMD_1.getActiveState(newFlow);
                    return [4 /*yield*/, typeorm_1.getRepository(Flow).save(newFlow)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, newFlow];
            }
        });
    });
}
function submitTask(flowId, userId, taskId, data, action) {
    return __awaiter(this, void 0, void 0, function () {
        var flow, submittedFlow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, typeorm_1.getRepository(Flow).findOne(flowId, { relations: ["steps"] })];
                case 1:
                    flow = _a.sent();
                    if (!flow) {
                        return [2 /*return*/, "n.a."];
                    }
                    submittedFlow = JSMD_1.submitTask(flow, userId, taskId, data, action);
                    if (typeof submittedFlow === "string") {
                        return [2 /*return*/, submittedFlow];
                    }
                    return [4 /*yield*/, saveNewStep(submittedFlow, flow)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.submitTask = submitTask;
function getTask() {
}
exports.getTask = getTask;
