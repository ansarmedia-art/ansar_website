import{a as ve,u as Me,b as D,c as xe,j as p}from"./index-D91KGT9A.js";import{r as N,L as Pe}from"./vendor-M7MsOkUS.js";import{L as Le,F as De,x as ke,_ as $e,y as Ue,z as je,A as Fe,C as Ge,B as ae}from"./firebase-CYr5xyYT.js";var ie="@firebase/ai",X="2.13.0";/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x="AI",oe="us-central1",Be="firebasevertexai.googleapis.com",V="v1beta",re=X,Ve="gl-js",He="hybrid",qe=180*1e3,Ke="gemini-2.5-flash-lite";/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h extends De{constructor(t,n,s){const a=x,i=`${a}/${t}`,o=`${a}: ${n} (${i})`;super(t,o),this.code=t,this.customErrorData=s,Error.captureStackTrace&&Error.captureStackTrace(this,h),Object.setPrototypeOf(this,h.prototype),this.toString=()=>o}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ce=["user","model","function","system"],ge={HARM_SEVERITY_UNSUPPORTED:"HARM_SEVERITY_UNSUPPORTED"},w={SAFETY:"SAFETY",RECITATION:"RECITATION",BLOCKLIST:"BLOCKLIST",PROHIBITED_CONTENT:"PROHIBITED_CONTENT",SPII:"SPII",MALFORMED_FUNCTION_CALL:"MALFORMED_FUNCTION_CALL",IMAGE_SAFETY:"IMAGE_SAFETY",IMAGE_PROHIBITED_CONTENT:"IMAGE_PROHIBITED_CONTENT",IMAGE_OTHER:"IMAGE_OTHER",NO_IMAGE:"NO_IMAGE",IMAGE_RECITATION:"IMAGE_RECITATION",LANGUAGE:"LANGUAGE",UNEXPECTED_TOOL_CALL:"UNEXPECTED_TOOL_CALL",TOO_MANY_TOOL_CALLS:"TOO_MANY_TOOL_CALLS",MISSING_THOUGHT_SIGNATURE:"MISSING_THOUGHT_SIGNATURE",MALFORMED_RESPONSE:"MALFORMED_RESPONSE"},S={PREFER_ON_DEVICE:"prefer_on_device",ONLY_ON_DEVICE:"only_on_device",ONLY_IN_CLOUD:"only_in_cloud",PREFER_IN_CLOUD:"prefer_in_cloud"},R={ON_DEVICE:"on_device",IN_CLOUD:"in_cloud"};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const u={ERROR:"error",REQUEST_ERROR:"request-error",RESPONSE_ERROR:"response-error",FETCH_ERROR:"fetch-error",SESSION_CLOSED:"session-closed",INVALID_CONTENT:"invalid-content",API_NOT_ENABLED:"api-not-enabled",INVALID_SCHEMA:"invalid-schema",NO_API_KEY:"no-api-key",NO_APP_ID:"no-app-id",NO_MODEL:"no-model",NO_PROJECT_ID:"no-project-id",PARSE_FAILED:"parse-failed",UNSUPPORTED:"unsupported"};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I={VERTEX_AI:"VERTEX_AI",GOOGLE_AI:"GOOGLE_AI"};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee{constructor(t){this.backendType=t}}class q extends Ee{constructor(){super(I.GOOGLE_AI)}_getModelPath(t,n){return`/${V}/projects/${t}/${n}`}_getTemplatePath(t,n){return`/${V}/projects/${t}/templates/${n}`}}class Q extends Ee{constructor(t=oe){super(I.VERTEX_AI),t?this.location=t:this.location=oe}_getModelPath(t,n){return`/${V}/projects/${t}/locations/${this.location}/${n}`}_getTemplatePath(t,n){return`/${V}/projects/${t}/locations/${this.location}/templates/${n}`}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ye(e){if(e instanceof q)return`${x}/googleai`;if(e instanceof Q)return`${x}/vertexai/${e.location}`;throw new h(u.ERROR,`Invalid backend: ${JSON.stringify(e.backendType)}`)}function Je(e){const t=e.split("/");if(t[0]!==x)throw new h(u.ERROR,`Invalid instance identifier, unknown prefix '${t[0]}'`);switch(t[1]){case"vertexai":const s=t[2];if(!s)throw new h(u.ERROR,`Invalid instance identifier, unknown location '${e}'`);return new Q(s);case"googleai":return new q;default:throw new h(u.ERROR,`Invalid instance identifier string: '${e}'`)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b=new Le("@firebase/vertexai");var T;(function(e){e.UNAVAILABLE="unavailable",e.DOWNLOADABLE="downloadable",e.DOWNLOADING="downloading",e.AVAILABLE="available"})(T||(T={}));/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ae={type:"text",languages:["en"]},K=[Ae,{type:"image"}],Y=[Ae];class O{constructor(t,n,s){this.languageModelProvider=t,this.mode=n,this.downloadPromise=null,this.onDeviceParams={createOptions:{expectedInputs:K,expectedOutputs:Y}},s&&(this.onDeviceParams=s,this.onDeviceParams.createOptions?(this.onDeviceParams.createOptions.expectedInputs||(this.onDeviceParams.createOptions.expectedInputs=K),this.onDeviceParams.createOptions.expectedOutputs||(this.onDeviceParams.createOptions.expectedOutputs=Y)):this.onDeviceParams.createOptions={expectedInputs:K,expectedOutputs:Y})}async isAvailable(t){var s;if(!this.mode)return b.debug("On-device inference unavailable because mode is undefined."),!1;if(this.mode===S.ONLY_IN_CLOUD)return b.debug('On-device inference unavailable because mode is "only_in_cloud".'),!1;const n=await((s=this.languageModelProvider)==null?void 0:s.availability(this.onDeviceParams.createOptions));if(this.mode===S.ONLY_ON_DEVICE){if(n===T.UNAVAILABLE)throw new h(u.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(n===T.DOWNLOADABLE||n===T.DOWNLOADING){b.debug("Waiting for download of LanguageModel to complete.");try{await this.downloadPromise}catch(a){throw new h(u.ERROR,a.message)}return!0}return!0}return n!==T.AVAILABLE?(b.debug(`On-device inference unavailable because availability is "${n}".`),!1):O.isOnDeviceRequest(t)?!0:(b.debug("On-device inference unavailable because request is incompatible."),!1)}async generateContent(t){const n=await this.createSession(),s=await Promise.all(t.contents.map(O.toLanguageModelMessage)),a=await n.prompt(s,this.onDeviceParams.promptOptions);return O.toResponse(a)}async generateContentStream(t){const n=await this.createSession(),s=await Promise.all(t.contents.map(O.toLanguageModelMessage)),a=n.promptStreaming(s,this.onDeviceParams.promptOptions);return O.toStreamResponse(a)}async countTokens(t){throw new h(u.REQUEST_ERROR,"Count Tokens is not yet available for on-device model.")}static isOnDeviceRequest(t){if(t.contents.length===0)return b.debug("Empty prompt rejected for on-device inference."),!1;for(const n of t.contents){if(n.role==="function")return b.debug('"Function" role rejected for on-device inference.'),!1;for(const s of n.parts)if(s.inlineData&&O.SUPPORTED_MIME_TYPES.indexOf(s.inlineData.mimeType)===-1)return b.debug(`Unsupported mime type "${s.inlineData.mimeType}" rejected for on-device inference.`),!1}return!0}async downloadIfAvailable(t){var s;const n=await((s=this.languageModelProvider)==null?void 0:s.availability(this.onDeviceParams.createOptions));return(n===T.DOWNLOADABLE||n===T.DOWNLOADING)&&this.download(t),n}download(t){var s;if(this.downloadPromise)return;const n={...this.onDeviceParams.createOptions};n&&!n.monitor&&t&&(n.monitor=a=>{a.addEventListener("downloadprogress",i=>{t(i.loaded)})}),this.downloadPromise=(s=this.languageModelProvider)==null?void 0:s.create(n).finally(()=>{this.downloadPromise=null})}static async toLanguageModelMessage(t){const n=await Promise.all(t.parts.map(O.toLanguageModelMessageContent));return{role:O.toLanguageModelMessageRole(t.role),content:n}}static async toLanguageModelMessageContent(t){if(t.text)return{type:"text",value:t.text};if(t.inlineData){const s=await(await fetch(`data:${t.inlineData.mimeType};base64,${t.inlineData.data}`)).blob();return{type:"image",value:await createImageBitmap(s)}}throw new h(u.REQUEST_ERROR,"Processing of this Part type is not currently supported.")}static toLanguageModelMessageRole(t){return t==="model"?"assistant":"user"}async createSession(){if(!this.languageModelProvider)throw new h(u.UNSUPPORTED,"Chrome AI requested for unsupported browser version.");const t=await this.languageModelProvider.create(this.onDeviceParams.createOptions);return this.oldSession&&this.oldSession.destroy(),this.oldSession=t,t}static toResponse(t){return{json:async()=>({candidates:[{content:{parts:[{text:t}]}}]})}}static toStreamResponse(t){const n=new TextEncoder;return{body:t.pipeThrough(new TransformStream({transform(s,a){const i=JSON.stringify({candidates:[{content:{role:"model",parts:[{text:s}]}}]});a.enqueue(n.encode(`data: ${i}

`))}}))}}}O.SUPPORTED_MIME_TYPES=["image/jpeg","image/png"];function ze(e,t,n){if(typeof t<"u"&&e)return new O(t.LanguageModel,e,n)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(t,n,s,a,i){this.app=t,this.backend=n,this.chromeAdapterFactory=i;const o=a==null?void 0:a.getImmediate({optional:!0}),c=s==null?void 0:s.getImmediate({optional:!0});this.auth=c||null,this.appCheck=o||null,n instanceof Q?this.location=n.location:this.location=""}_delete(){return Promise.resolve()}set options(t){this._options=t}get options(){return this._options}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xe(e,{instanceIdentifier:t}){if(!t)throw new h(u.ERROR,"AIService instance identifier is undefined.");const n=Je(t),s=e.getProvider("app").getImmediate(),a=e.getProvider("auth-internal"),i=e.getProvider("app-check-internal");return new We(s,n,a,i,ze)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qe(e){var n,s,a,i,o,c,l;if((s=(n=e.app)==null?void 0:n.options)!=null&&s.apiKey)if((i=(a=e.app)==null?void 0:a.options)!=null&&i.projectId){if(!((c=(o=e.app)==null?void 0:o.options)!=null&&c.appId))throw new h(u.NO_APP_ID,'The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.')}else throw new h(u.NO_PROJECT_ID,'The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.');else throw new h(u.NO_API_KEY,'The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.');const t={apiKey:e.app.options.apiKey,project:e.app.options.projectId,appId:e.app.options.appId,automaticDataCollectionEnabled:e.app.automaticDataCollectionEnabled,location:e.location,backend:e.backend};if(je(e.app)&&e.app.settings.appCheckToken){const d=e.app.settings.appCheckToken;t.getAppCheckToken=()=>Promise.resolve({token:d})}else e.appCheck&&((l=e.options)!=null&&l.useLimitedUseAppCheckTokens?t.getAppCheckToken=()=>e.appCheck.getLimitedUseToken():t.getAppCheckToken=()=>e.appCheck.getToken());return e.auth&&(t.getAuthToken=()=>e.auth.getToken()),t}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{constructor(t,n){this._apiSettings=Qe(t),this.model=U.normalizeModelName(n,this._apiSettings.backend.backendType)}static normalizeModelName(t,n){return n===I.GOOGLE_AI?U.normalizeGoogleAIModelName(t):U.normalizeVertexAIModelName(t)}static normalizeGoogleAIModelName(t){return`models/${t}`}static normalizeVertexAIModelName(t){let n;return t.includes("/")?t.startsWith("models/")?n=`publishers/google/${t}`:n=t:n=`publishers/google/models/${t}`,n}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ze="Timeout has expired.",J="AbortError";class et{constructor(t){this.params=t}toString(){const t=new URL(this.baseUrl);return t.pathname=this.pathname,t.search=this.queryParams.toString(),t.toString()}get pathname(){return this.params.templateId?`${this.params.apiSettings.backend._getTemplatePath(this.params.apiSettings.project,this.params.templateId)}:${this.params.task}`:`${this.params.apiSettings.backend._getModelPath(this.params.apiSettings.project,this.params.model)}:${this.params.task}`}get baseUrl(){var t;return((t=this.params.singleRequestOptions)==null?void 0:t.baseUrl)??`https://${Be}`}get queryParams(){const t=new URLSearchParams;return this.params.stream&&t.set("alt","sse"),t}}function tt(e){const t=[];return t.push(`${Ve}/${re}`),t.push(`fire/${re}`),(e.params.apiSettings.inferenceMode===S.PREFER_ON_DEVICE||e.params.apiSettings.inferenceMode===S.PREFER_IN_CLOUD)&&t.push(He),t.join(" ")}async function nt(e){const t=new Headers;if(t.append("Content-Type","application/json"),t.append("x-goog-api-client",tt(e)),t.append("x-goog-api-key",e.params.apiSettings.apiKey),e.params.apiSettings.automaticDataCollectionEnabled&&t.append("X-Firebase-Appid",e.params.apiSettings.appId),e.params.apiSettings.getAppCheckToken){const n=await e.params.apiSettings.getAppCheckToken();n&&(t.append("X-Firebase-AppCheck",n.token),n.error&&b.warn(`Unable to obtain a valid App Check token: ${n.error.message}`))}if(e.params.apiSettings.getAuthToken){const n=await e.params.apiSettings.getAuthToken();n&&t.append("Authorization",`Firebase ${n.accessToken}`)}return t}async function Z(e,t){var d,E;const n=new et(e);let s;const a=(d=e.singleRequestOptions)==null?void 0:d.signal,i=((E=e.singleRequestOptions)==null?void 0:E.timeout)!=null&&e.singleRequestOptions.timeout>=0?e.singleRequestOptions.timeout:qe,o=new AbortController,c=setTimeout(()=>{o.abort(new DOMException(Ze,J)),b.debug(`Aborting request to ${n} due to timeout (${i}ms)`)},i),l=AbortSignal.any(a?[a,o.signal]:[o.signal]);if(a&&a.aborted)throw clearTimeout(c),new DOMException(a.reason??"Aborted externally before fetch",J);try{const f={method:"POST",headers:await nt(n),signal:l,body:t};if(s=await fetch(n.toString(),f),!s.ok){let A="",r;try{const m=await s.json();A=m.error.message,m.error.details&&(A+=` ${JSON.stringify(m.error.details)}`,r=m.error.details)}catch{}throw s.status===403&&r&&r.some(m=>m.reason==="SERVICE_DISABLED")&&r.some(m=>{var P,L;return(L=(P=m.links)==null?void 0:P[0])==null?void 0:L.description.includes("Google developers console API activation")})?new h(u.API_NOT_ENABLED,`The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${n.params.apiSettings.project}/ailogic/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:s.status,statusText:s.statusText,errorDetails:r}):new h(u.FETCH_ERROR,`Error fetching from ${n}: [${s.status} ${s.statusText}] ${A}`,{status:s.status,statusText:s.statusText,errorDetails:r})}}catch(f){let A=f;throw f.code!==u.FETCH_ERROR&&f.code!==u.API_NOT_ENABLED&&f instanceof Error&&f.name!==J&&(A=new h(u.ERROR,`Error fetching from ${n.toString()}: ${f.message}`),A.stack=f.stack),A}finally{clearTimeout(c)}return s}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(e){if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&b.warn(`This response had ${e.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),we(e.candidates[0]))throw new h(u.RESPONSE_ERROR,`Response error: ${_(e)}. Response body stored in error.response`,{response:e});return!0}else return!1}function H(e,t=R.IN_CLOUD){e.candidates&&!e.candidates[0].hasOwnProperty("index")&&(e.candidates[0].index=0);const n=st(e);return n.inferenceSource=t,n}function st(e){return e.text=()=>{if(B(e))return le(e,t=>!t.thought);if(e.promptFeedback)throw new h(u.RESPONSE_ERROR,`Text not available. ${_(e)}`,{response:e});return""},e.thoughtSummary=()=>{if(B(e)){const t=le(e,n=>!!n.thought);return t===""?void 0:t}else if(e.promptFeedback)throw new h(u.RESPONSE_ERROR,`Thought summary not available. ${_(e)}`,{response:e})},e.inlineDataParts=()=>{if(B(e))return at(e);if(e.promptFeedback)throw new h(u.RESPONSE_ERROR,`Data not available. ${_(e)}`,{response:e})},e.functionCalls=()=>{if(B(e))return be(e);if(e.promptFeedback)throw new h(u.RESPONSE_ERROR,`Function call not available. ${_(e)}`,{response:e})},e}function le(e,t){var s,a,i,o;const n=[];if((a=(s=e.candidates)==null?void 0:s[0].content)!=null&&a.parts)for(const c of(o=(i=e.candidates)==null?void 0:i[0].content)==null?void 0:o.parts)c.text&&t(c)&&n.push(c.text);return n.length>0?n.join(""):""}function be(e){var n,s,a,i;if(!e)return;const t=[];if((s=(n=e.candidates)==null?void 0:n[0].content)!=null&&s.parts)for(const o of(i=(a=e.candidates)==null?void 0:a[0].content)==null?void 0:i.parts)o.functionCall&&t.push(o.functionCall);if(t.length>0)return t}function at(e){var n,s,a,i;const t=[];if((s=(n=e.candidates)==null?void 0:n[0].content)!=null&&s.parts)for(const o of(i=(a=e.candidates)==null?void 0:a[0].content)==null?void 0:i.parts)o.inlineData&&t.push(o);if(t.length>0)return t}const it=[w.RECITATION,w.SAFETY,w.BLOCKLIST,w.PROHIBITED_CONTENT,w.SPII,w.MALFORMED_FUNCTION_CALL,w.IMAGE_SAFETY,w.IMAGE_PROHIBITED_CONTENT,w.IMAGE_OTHER,w.NO_IMAGE,w.IMAGE_RECITATION,w.LANGUAGE,w.UNEXPECTED_TOOL_CALL,w.TOO_MANY_TOOL_CALLS,w.MISSING_THOUGHT_SIGNATURE,w.MALFORMED_RESPONSE];function we(e){return!!e.finishReason&&it.some(t=>t===e.finishReason)}function _(e){var n,s,a;let t="";if((!e.candidates||e.candidates.length===0)&&e.promptFeedback)t+="Response was blocked",(n=e.promptFeedback)!=null&&n.blockReason&&(t+=` due to ${e.promptFeedback.blockReason}`),(s=e.promptFeedback)!=null&&s.blockReasonMessage&&(t+=`: ${e.promptFeedback.blockReasonMessage}`);else if((a=e.candidates)!=null&&a[0]){const i=e.candidates[0];we(i)&&(t+=`Candidate was blocked due to ${i.finishReason}`,i.finishMessage&&(t+=`: ${i.finishMessage}`))}return t}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ye(e){var t,n;if((t=e.safetySettings)==null||t.forEach(s=>{if(s.method)throw new h(u.UNSUPPORTED,"SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.")}),(n=e.generationConfig)!=null&&n.topK){const s=Math.round(e.generationConfig.topK);s!==e.generationConfig.topK&&(b.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API."),e.generationConfig.topK=s)}return e}function ee(e){return{candidates:e.candidates?rt(e.candidates):void 0,prompt:e.promptFeedback?ct(e.promptFeedback):void 0,usageMetadata:e.usageMetadata}}function ot(e,t){return{generateContentRequest:{model:t,...e}}}function rt(e){const t=[];let n;return t&&e.forEach(s=>{var o,c;let a;if(s.citationMetadata&&(a={citations:s.citationMetadata.citationSources}),s.safetyRatings&&(n=s.safetyRatings.map(l=>({...l,severity:l.severity??ge.HARM_SEVERITY_UNSUPPORTED,probabilityScore:l.probabilityScore??0,severityScore:l.severityScore??0}))),(c=(o=s.content)==null?void 0:o.parts)!=null&&c.some(l=>l==null?void 0:l.videoMetadata))throw new h(u.UNSUPPORTED,"Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");const i={index:s.index,content:s.content,finishReason:s.finishReason,finishMessage:s.finishMessage,safetyRatings:n,citationMetadata:a,groundingMetadata:s.groundingMetadata,urlContextMetadata:s.urlContextMetadata};t.push(i)}),t}function ct(e){const t=[];return e.safetyRatings.forEach(s=>{t.push({category:s.category,probability:s.probability,severity:s.severity??ge.HARM_SEVERITY_UNSUPPORTED,probabilityScore:s.probabilityScore??0,severityScore:s.severityScore??0,blocked:s.blocked})}),{blockReason:e.blockReason,safetyRatings:t,blockReasonMessage:e.blockReasonMessage}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const de=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function lt(e,t,n){const s=e.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),a=pt(s),[i,o]=a.tee(),{response:c,firstValue:l}=await dt(o,t,n);return{stream:ht(i,t,n),response:c,firstValue:l}}async function dt(e,t,n){const[s,a]=e.tee(),i=s.getReader(),{value:o}=await i.read();return{firstValue:o,response:ut(a,t,n)}}async function ut(e,t,n){const s=[],a=e.getReader();for(;;){const{done:i,value:o}=await a.read();if(i){let c=ft(s);return t.backend.backendType===I.GOOGLE_AI&&(c=ee(c)),H(c,n)}s.push(o)}}async function*ht(e,t,n){var a,i;const s=e.getReader();for(;;){const{value:o,done:c}=await s.read();if(c)break;let l;t.backend.backendType===I.GOOGLE_AI?l=H(ee(o),n):l=H(o,n);const d=(a=l.candidates)==null?void 0:a[0];!((i=d==null?void 0:d.content)!=null&&i.parts)&&!(d!=null&&d.finishReason)&&!(d!=null&&d.citationMetadata)&&!(d!=null&&d.urlContextMetadata)||(yield l)}}function pt(e){const t=e.getReader();return new ReadableStream({start(s){let a="";return i();function i(){return t.read().then(({value:o,done:c})=>{if(c){if(a.trim()){s.error(new h(u.PARSE_FAILED,"Failed to parse stream"));return}s.close();return}a+=o;let l=a.match(de),d;for(;l;){try{d=JSON.parse(l[1])}catch{s.error(new h(u.PARSE_FAILED,`Error parsing JSON response: "${l[1]}`));return}s.enqueue(d),a=a.substring(l[0].length),l=a.match(de)}return i()})}}})}function ft(e){const t=e[e.length-1],n={promptFeedback:t==null?void 0:t.promptFeedback};for(const s of e)if(s.candidates)for(const a of s.candidates){const i=a.index||0;n.candidates||(n.candidates=[]),n.candidates[i]||(n.candidates[i]={index:a.index}),n.candidates[i].citationMetadata=a.citationMetadata,n.candidates[i].finishReason=a.finishReason,n.candidates[i].finishMessage=a.finishMessage,n.candidates[i].safetyRatings=a.safetyRatings,n.candidates[i].groundingMetadata=a.groundingMetadata;const o=a.urlContextMetadata;if(typeof o=="object"&&o!==null&&Object.keys(o).length>0&&(n.candidates[i].urlContextMetadata=o),a.content){if(!a.content.parts)continue;n.candidates[i].content||(n.candidates[i].content={role:a.content.role||"user",parts:[]});for(const c of a.content.parts){const l={...c};c.text!==""&&Object.keys(l).length>0&&n.candidates[i].content.parts.push(l)}}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mt=[u.FETCH_ERROR,u.ERROR,u.API_NOT_ENABLED];async function Oe(e,t,n,s){if(!t)return{response:await s(),inferenceSource:R.IN_CLOUD};switch(t.mode){case S.ONLY_ON_DEVICE:if(await t.isAvailable(e))return{response:await n(),inferenceSource:R.ON_DEVICE};throw new h(u.UNSUPPORTED,"Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.");case S.ONLY_IN_CLOUD:return{response:await s(),inferenceSource:R.IN_CLOUD};case S.PREFER_IN_CLOUD:try{return{response:await s(),inferenceSource:R.IN_CLOUD}}catch(a){if(a instanceof h&&mt.includes(a.code)&&await t.isAvailable(e))return{response:await n(),inferenceSource:R.ON_DEVICE};throw a}case S.PREFER_ON_DEVICE:return await t.isAvailable(e)?{response:await n(),inferenceSource:R.ON_DEVICE}:{response:await s(),inferenceSource:R.IN_CLOUD};default:throw new h(u.ERROR,`Unexpected infererence mode: ${t.mode}`)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gt(e,t,n,s){return e.backend.backendType===I.GOOGLE_AI&&(n=ye(n)),Z({task:"streamGenerateContent",model:t,apiSettings:e,stream:!0,singleRequestOptions:s},JSON.stringify(n))}async function Se(e,t,n,s,a){const i=await Oe(n,s,()=>s.generateContentStream(n),()=>gt(e,t,n,a));return lt(i.response,e,i.inferenceSource)}async function Et(e,t,n,s){return e.backend.backendType===I.GOOGLE_AI&&(n=ye(n)),Z({model:t,task:"generateContent",apiSettings:e,stream:!1,singleRequestOptions:s},JSON.stringify(n))}async function Te(e,t,n,s,a){const i=await Oe(n,s,()=>s.generateContent(n),()=>Et(e,t,n,a)),o=await At(i.response,e);return{response:H(o,i.inferenceSource)}}async function At(e,t){const n=await e.json();return t.backend.backendType===I.GOOGLE_AI?ee(n):n}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ie(e){if(e!=null){if(typeof e=="string")return{role:"system",parts:[{text:e}]};if(e.text)return{role:"system",parts:[e]};if(e.parts)return e.role?e:{role:"system",parts:e.parts}}}function $(e){let t=[];if(typeof e=="string")t=[{text:e}];else for(const n of e)typeof n=="string"?t.push({text:n}):t.push(n);return bt(t)}function bt(e){const t={role:"user",parts:[]},n={role:"function",parts:[]};let s=!1,a=!1;for(const i of e)"functionResponse"in i?(n.parts.push(i),a=!0):(t.parts.push(i),s=!0);if(s&&a)throw new h(u.INVALID_CONTENT,"Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!s&&!a)throw new h(u.INVALID_CONTENT,"No Content is provided for sending chat message.");return s?t:n}function z(e){let t;return e.contents?t=e:t={contents:[$(e)]},e.systemInstruction&&(t.systemInstruction=Ie(e.systemInstruction)),t}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ue="SILENT_ERROR",he=10;class wt{constructor(t,n,s){this.params=n,this.requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=t}async getHistory(){return await this._sendPromise,this._history}async _sendMessage(t,n){let s={};await this._sendPromise;const a=[];return this._sendPromise=this._sendPromise.then(async()=>{var l,d,E;let i,o=0;const c=((l=this.requestOptions)==null?void 0:l.maxSequentialFunctionCalls)??he;do{let f;if(i){o++;const m=await this._callFunctionsAsNeeded(i);f=$(m)}else f=$(t);const A=this._formatRequest(f,[...a]);a.push(f);const r=await this._callGenerateContent(A,n);if(r)if(s=r,i=this._getCallableFunctionCalls(r.response),r.response.candidates&&r.response.candidates.length>0){const m={parts:((d=r.response.candidates)==null?void 0:d[0].content.parts)||[],role:((E=r.response.candidates)==null?void 0:E[0].content.role)||"model"};a.push(m)}else{const m=_(r.response);m&&b.warn(`sendMessage() was unsuccessful. ${m}. Inspect response object for details.`)}else i=void 0}while(i&&o<c);i&&o>=c&&b.warn(`Automatic function calling exceeded the limit of ${c} function calls. Returning last model response.`)}),await this._sendPromise,this._history=this._history.concat(a),s}async _sendMessageStream(t,n){await this._sendPromise;const s=[],i=(async()=>{var E;let o,c=0;const l=((E=this.requestOptions)==null?void 0:E.maxSequentialFunctionCalls)??he;let d;do{let f;if(o){c++;const r=await this._callFunctionsAsNeeded(o);f=$(r)}else f=$(t);const A=this._formatRequest(f,[...s]);if(s.push(f),d=await this._callGenerateContentStream(A,n),o=this._getCallableFunctionCalls(d.firstValue),o&&d.firstValue&&d.firstValue.candidates&&d.firstValue.candidates.length>0){const r={...d.firstValue.candidates[0].content};r.role||(r.role="model"),s.push(r)}}while(o&&c<l);return o&&c>=l&&b.warn(`Automatic function calling exceeded the limit of ${l} function calls. Returning last model response.`),{stream:d.stream,response:d.response}})();return this._sendPromise=this._sendPromise.then(async()=>i).catch(o=>{throw new Error(ue)}).then(o=>o.response).then(o=>{if(o.candidates&&o.candidates.length>0){this._history=this._history.concat(s);const c={...o.candidates[0].content};c.role||(c.role="model"),this._history.push(c)}else{const c=_(o);c&&b.warn(`sendMessageStream() was unsuccessful. ${c}. Inspect response object for details.`)}}).catch(o=>{o.message!==ue&&o.name!=="AbortError"&&b.error(o)}),i}_getCallableFunctionCalls(t){var a,i,o;const n=(i=(a=this.params)==null?void 0:a.tools)==null?void 0:i.find(c=>c.functionDeclarations);if(!(n!=null&&n.functionDeclarations))return;const s=be(t);if(s){for(const c of s)if(!((o=n.functionDeclarations)==null?void 0:o.some(d=>d.name===c.name&&typeof d.functionReference=="function")))return;return s}}async _callFunctionsAsNeeded(t){var i,o;const n=[],s=[],a=(o=(i=this.params)==null?void 0:i.tools)==null?void 0:o.find(c=>c.functionDeclarations);if(a&&a.functionDeclarations){for(const l of t){const d=a.functionDeclarations.find(E=>E.name===l.name);if(d!=null&&d.functionReference){const E=Promise.resolve(d.functionReference(l.args)).catch(f=>{const A=new h(u.ERROR,`Error in user-defined function "${d.name}": ${f.message}`);throw A.stack=f.stack,A});n.push({name:l.name,id:l.id,results:E}),s.push(E)}}await Promise.all(s);const c=[];for(const{name:l,id:d,results:E}of n){const f={name:l,response:await E};d&&(f.id=d),c.push({functionResponse:f})}return c}else throw new h(u.REQUEST_ERROR,'No function declarations were provided in "tools".')}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pe=["text","inlineData","functionCall","functionResponse","thought","thoughtSignature"],yt={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","thought","thoughtSignature"],system:["text"]},fe={user:["model"],function:["model"],model:["user","function"],system:[]};function Ot(e){let t=null;for(const n of e){const{role:s,parts:a}=n;if(!t&&s!=="user")throw new h(u.INVALID_CONTENT,`First Content should be with role 'user', got ${s}`);if(!ce.includes(s))throw new h(u.INVALID_CONTENT,`Each item should include role field. Got ${s} but valid roles are: ${JSON.stringify(ce)}`);if(!Array.isArray(a))throw new h(u.INVALID_CONTENT,"Content should have 'parts' property with an array of Parts");if(a.length===0)throw new h(u.INVALID_CONTENT,"Each Content should have at least one part");const i={text:0,inlineData:0,functionCall:0,functionResponse:0,thought:0,thoughtSignature:0,executableCode:0,codeExecutionResult:0};for(const c of a)for(const l of pe)l in c&&(i[l]+=1);const o=yt[s];for(const c of pe)if(!o.includes(c)&&i[c]>0)throw new h(u.INVALID_CONTENT,`Content with role '${s}' can't contain '${c}' part`);if(t&&!fe[s].includes(t.role))throw new h(u.INVALID_CONTENT,`Content with role '${s}' can't follow '${t.role}'. Valid previous roles: ${JSON.stringify(fe)}`);t=n}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St extends wt{constructor(t,n,s,a,i){super(t,a,i),this.model=n,this.chromeAdapter=s,this.params=a,this.requestOptions=i,a!=null&&a.history&&(Ot(a.history),this._history=a.history)}_formatRequest(t,n){var s,a,i,o,c;return{safetySettings:(s=this.params)==null?void 0:s.safetySettings,generationConfig:(a=this.params)==null?void 0:a.generationConfig,tools:(i=this.params)==null?void 0:i.tools,toolConfig:(o=this.params)==null?void 0:o.toolConfig,systemInstruction:(c=this.params)==null?void 0:c.systemInstruction,contents:[...this._history,...n,t]}}_callGenerateContent(t,n){return Te(this._apiSettings,this.model,t,this.chromeAdapter,{...this.requestOptions,...n})}_callGenerateContentStream(t,n){return Se(this._apiSettings,this.model,t,this.chromeAdapter,{...this.requestOptions,...n})}async sendMessage(t,n){return this._sendMessage(t,n)}async sendMessageStream(t,n){return this._sendMessageStream(t,n)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Tt(e,t,n,s){let a="";if(e.backend.backendType===I.GOOGLE_AI){const o=ot(n,t);a=JSON.stringify(o)}else a=JSON.stringify(n);return(await Z({model:t,task:"countTokens",apiSettings:e,stream:!1,singleRequestOptions:s},a)).json()}async function It(e,t,n,s,a){if((s==null?void 0:s.mode)===S.ONLY_ON_DEVICE)throw new h(u.UNSUPPORTED,"countTokens() is not supported for on-device models.");return Tt(e,t,n,a)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct extends U{constructor(t,n,s,a){super(t,n.model),this.chromeAdapter=a,this.generationConfig=n.generationConfig||{},Rt(this.generationConfig),this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=Ie(n.systemInstruction),this.requestOptions=s||{}}async initializeDeviceModel(t){if(!this.chromeAdapter||this.chromeAdapter.mode===S.ONLY_IN_CLOUD)return;if(await this.chromeAdapter.downloadIfAvailable(t)===T.UNAVAILABLE){const s=new h(u.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(this.chromeAdapter.mode===S.ONLY_ON_DEVICE)throw s;b.debug(s.message)}await this.chromeAdapter.downloadPromise}async generateContent(t,n){const s=z(t);return Te(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...s},this.chromeAdapter,{...this.requestOptions,...n})}async generateContentStream(t,n){const s=z(t),{stream:a,response:i}=await Se(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...s},this.chromeAdapter,{...this.requestOptions,...n});return{stream:a,response:i}}startChat(t){return new St(this._apiSettings,this.model,this.chromeAdapter,{tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,generationConfig:this.generationConfig,safetySettings:this.safetySettings,...t},this.requestOptions)}async countTokens(t,n){const s=z(t);return It(this._apiSettings,this.model,s,this.chromeAdapter,{...this.requestOptions,...n})}}function Rt(e){var t,n;if(((t=e.thinkingConfig)==null?void 0:t.thinkingBudget)!=null&&((n=e.thinkingConfig)!=null&&n.thinkingLevel))throw new h(u.UNSUPPORTED,"Cannot set both thinkingBudget and thinkingLevel in a config.");if(e.responseSchema!=null&&e.responseJsonSchema!=null)throw new h(u.UNSUPPORTED,"Cannot set both responseSchema and responseJsonSchema in a config.");if((e.responseSchema!=null||e.responseJsonSchema!=null)&&e.responseMimeType!=="application/json")throw new h(u.UNSUPPORTED,'responseMimeType must be set to "application/json" if responseSchema or responseJsonSchema are set.')}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nt(e=Ue(),t){e=ke(e);const n=$e(e,x),s=(t==null?void 0:t.backend)??new q,a={useLimitedUseAppCheckTokens:(t==null?void 0:t.useLimitedUseAppCheckTokens)??!1},i=Ye(s),o=n.getImmediate({identifier:i});return o.options=a,o}const _t=["mode","onDeviceParams","inCloudParams"];function vt(e,t,n){var c;const s=t;let a;if(s.mode){for(const l of Object.keys(t))_t.includes(l)||b.warn(`When a hybrid inference mode is specified (mode is currently set to ${s.mode}), "${l}" cannot be configured at the top level. Configuration for in-cloud and on-device must be done separately in inCloudParams and onDeviceParams. Configuration values set outside of inCloudParams and onDeviceParams will be ignored.`);a=s.inCloudParams||{model:Ke}}else a=t;if(!a.model)throw new h(u.NO_MODEL,"Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");const i=(c=e.chromeAdapterFactory)==null?void 0:c.call(e,s.mode,typeof window>"u"?void 0:window,s.onDeviceParams),o=new Ct(e,a,n,i);return o._apiSettings.inferenceMode=s.mode,o}function Mt(){Fe(new Ge(x,Xe,"PUBLIC").setMultipleInstances(!0)),ae(ie,X),ae(ie,X,"esm2020")}Mt();const xt=Nt(ve,{backend:new q}),Pt="gemini-3.5-flash",te=[{label:"Admissions",path:"/admission",keywords:["admission","apply","fee","fees","payment","tc","prospectus"]},{label:"Academics",path:"/academics",keywords:["academic","class","cbse","curriculum","exam","learning"]},{label:"News",path:"/news",keywords:["news","update","announcement"]},{label:"Events",path:"/events",keywords:["event","program","celebration"]},{label:"Achievements",path:"/achievements",keywords:["achievement","award","winner"]},{label:"Mandatory Disclosure",path:"/mandatory-public-disclosure",keywords:["disclosure","document","public","mandatory"]},{label:"Ansar Times",path:"/ansar-times",keywords:["magazine","newsletter","ansar times"]},{label:"Contact",path:"/contact",keywords:["contact","phone","email","location","address","whatsapp"]}],Lt=["Tell me about Ansar English School","Explain the school leadership","Guide me through this website","Guide me for admission"],Dt=["History: Ansar English School was founded in 1980/1982 as the flagship educational institution of Ansari Charitable Trust in Perumpilavu. It grew from a humble initiative into a respected CBSE Senior Secondary school in Kerala.","Milestones: Ansari Charitable Trust got registered in 1979. The school got registered in 1982, received CBSE affiliation in 1988, became Senior Secondary in 1990, sent its first Class XII batch in 1992, received NABET accreditation in 2024, and marked 2026 as the Year of Sustainability.","Trust and service: The school is shaped by Ansari Charitable Trust, whose wider service ecosystem includes education, healthcare, social welfare, an orphanage, a special school, and women's education initiatives.","Scale: The campus serves over 4,600 students with 270+ educators/staff members and has 40+ years of service in value-based education.","Affiliation and accreditation: Ansar English School is affiliated with CBSE, New Delhi, and is NABET accredited. The site presents it as the first school in Thrissur accredited by NABET.","Facilities: a safe and secure CCTV-supported campus, future-ready learning spaces with smart boards, a dedicated support team, joyful play zone, experiential learning labs, Champions Arena, safe school transport, healthy dining spaces, ATL tinkering/innovation spaces, science and computer labs, language enrichment, exam preparation support, and a library with more than 34,000 books and learning resources.","Academic pathway: Ansar Sprouts for foundational early learning, Primary School for literacy/numeracy/environmental awareness, Middle School for concept clarity and analytical thinking, and Senior Secondary for subject depth, practical work, projects, and CBSE exam preparation.","Campus life: The school supports sports, arts, innovation, entrepreneurship, environmental stewardship, community engagement, Student Police Cadet, NSS, clubs, NIOS, life skills, leadership, and co-curricular programmes.","Ansar Media and Production: An in-house media unit for photography, videography, drone videography, podcast production, graphic designing, editing, event documentation, social media creatives, reels, institutional presentations, and communication support for school activities.","Virtual tour: A 360 degree virtual campus tour is linked from the About page at https://www.p4panorama.com/360-virtual-tour/ansar-school/."].join(`
`),kt=["Chairman: MAMMUNNI K K","Acting Chairman: V T ABDULLAH KOYA THANGAL","Vice Chairman: MOHAMMED K V","Secretary: E A KUNJAHAMMU","Assistant Secretary: SHAJU MOHAMEDUNNI","Trust/Managing Committee members listed on the website include NAJEEB P, MOHAMMED AMEEN E M, MOOSA V, NOOR MOHAMMED KAMALUDHEEN, MUHAMMED SHEREEF E V, ABDUL HAMEED, K K SHANAVAS, MOHAMED KUTTY KAYINGIL, ISMAIL KASIM, SHOUKATH ALI KOROTH, T A MOIDEEN ALIAS MOIDUTTY, M I ABDUL AZEEZ, A USMAN, ANWAR ABDUL MAJEED, MUJEEB RAHMAN P, Dr. MOHAMED BADEEUZZAMAN, Dr. MOHAMMED ALI MAMPPILLY (KOOTTIL), and P I NOUSHAD."].join(`
`);function $t(e=""){return String(e).replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}function W(e="",t=220){const n=$t(e);return n.length>t?`${n.slice(0,t).trim()}...`:n}function k(e,t){return e.filter(n=>n&&n.published!==!1).slice(0,6).map(n=>t.map(s=>n[s]).filter(Boolean).join(" - ")).filter(Boolean).join(`
`)}function M(e){var n,s;const t=Date.parse(e==null?void 0:e.date);return Number.isNaN(t)?(n=e==null?void 0:e.createdAt)!=null&&n.toMillis?e.createdAt.toMillis():(s=e==null?void 0:e.createdAt)!=null&&s.seconds?e.createdAt.seconds*1e3:Number.MIN_SAFE_INTEGER:t}function Ut({settings:e,updates:t,achievements:n,disclosures:s,ansarTimes:a,pages:i,leadership:o}){const c=t.filter(r=>r.published!==!1&&(r.category==="News"||!r.category)).sort((r,m)=>M(m)-M(r)),l=t.filter(r=>r.published!==!1&&r.category==="Events").sort((r,m)=>M(m)-M(r)),d=[...n].sort((r,m)=>M(m)-M(r)),E=i.filter(r=>(r==null?void 0:r.published)!==!1).slice(0,8).map(r=>`${r.title||r.slug}: ${W(r.bodyHtml||r.content||r.description,180)}`).join(`
`),f=o.filter(r=>(r==null?void 0:r.published)!==!1).slice(0,14).map(r=>[r.role||r.section,r.name,r.qualification||r.qualifications].filter(Boolean).join(" - ")).filter(Boolean).join(`
`),A=Array.isArray(e==null?void 0:e.juniorPrincipals)?e.juniorPrincipals.filter(r=>(r==null?void 0:r.name)||(r==null?void 0:r.section)).map(r=>[r.section||"Junior Principal",r.name,r.qualification||r.qualifications].filter(Boolean).join(" - ")).join(`
`):"";return["School: Ansar English School, Perumpilavu, Thrissur, Kerala. CBSE-affiliated and NABET accredited.",Dt,kt,"Contact: Phone +91 81298 08051. Email hr@ansar.in. Address Ansar English School, Perumpilavu, Karikkad P.O, Thrissur, Kerala - 680519.","Admission: Applications are open annually from Jan 01 to March 31. Above LKG requires a language proficiency and diagnostic assessment. Admission and payment portal: https://ansartrust.atcampussolutions.com/school/.",`Fee structure: ${(e==null?void 0:e.feeStructureTitle)||"Fee Structure"} - ${(e==null?void 0:e.feeStructurePdfUrl)||"available on the Admission page"}.`,`Vision: ${W(e==null?void 0:e.visionText,240)}`,`Mission: ${W(e==null?void 0:e.missionText,360)}`,`Director: ${(e==null?void 0:e.directorName)||"Dr. Najeeb Mohamad"} ${(e==null?void 0:e.directorQualifications)||""}.`,`Principal: ${(e==null?void 0:e.principalName)||"Ms. Sajidha Razak"} ${(e==null?void 0:e.principalQualifications)||""}.`,`Leadership and staff from admin/settings:
${f||A||"Director, Principal, Junior Principals, teachers, and support staff are represented on the website/admin panel."}`,`Junior Principals from settings:
${A||"Junior principal details are available on the home page when configured."}`,`News by date:
${k(c,["date","title","description"])||"No published news currently loaded."}`,`Events by date:
${k(l,["date","title","description"])||"No published events currently loaded."}`,`Achievements:
${k(d,["date","title","studentName","description"])||"No published achievements currently loaded."}`,`Public disclosure documents:
${k(s,["section","title"])||"No public disclosure documents currently loaded."}`,`Ansar Times:
${k(a,["year","month"])||"No magazine issues currently loaded."}`,`Admin-managed pages:
${E||"No extra admin pages currently loaded."}`,`Navigation map: ${te.map(r=>`${r.label}=${r.path}`).join(", ")}, Ansar Media and Production=/ansar-media-production, Sports=/sports-page, ATL=/atl, Ansar Sprouts=/ansar-sprouts, Life at Ansar=/life-at-ansar.`].join(`

`)}function Ce(e){const t=e.toLowerCase();return te.filter(n=>n.keywords.some(s=>t.includes(s))).slice(0,3)}function jt(e){const t=e.toLowerCase();return["institution","school","ansar","about","history","leader","leadership","principal","director","trust","trustee","website","site","navigate","facilities","campus"].some(n=>t.includes(n))}function me(e,t){const n=Ce(e),s=e.toLowerCase();return s.includes("contact")||s.includes("phone")||s.includes("email")||s.includes("location")?"You can contact Ansar English School at +91 81298 08051 or email hr@ansar.in. The campus is at Perumpilavu, Karikkad P.O, Thrissur, Kerala - 680519. Please open the Contact page for the map and inquiry form.":s.includes("admission")||s.includes("fee")||s.includes("payment")?"For admissions, visit the Admission page. Applications are open annually from Jan 01 to March 31, and fee details are available there. The online admission and payment portal is also linked from that page.":s.includes("history")||s.includes("founded")||s.includes("started")||s.includes("trust")?"Ansar English School is the flagship educational institution of Ansari Charitable Trust in Perumpilavu, Thrissur. The Trust was registered in 1979, the school was registered in 1982, received CBSE affiliation in 1988, became Senior Secondary in 1990, and received NABET accreditation in 2024. The institution presents itself as a value-based CBSE school with a strong focus on academics, discipline, student development, facilities, community service, and sustainable growth. You can open the About page for the full timeline, trustee details, and institutional profile.":s.includes("leader")||s.includes("principal")||s.includes("director")||s.includes("staff")?"The school leadership shown on the website includes the Director, Principal, Junior Principals, trustees, teachers, and support staff. The website highlights Dr. Najeeb Mohamad as Director and Ms. Sajidha Razak as Principal when configured through settings, along with junior principal profiles and trustee information. Ansar has 270+ educators and staff members supporting over 4,600 students. For profile photos, qualifications, messages, and current leadership details, please open the Home and About pages.":s.includes("facility")||s.includes("facilities")||s.includes("lab")||s.includes("library")||s.includes("sports")||s.includes("transport")?"Ansar facilities include a safe and secure CCTV-supported campus, future-ready learning spaces with smart boards, experiential learning labs, ATL innovation space, language enrichment, a library with 34,000+ resources, Champions Arena, joyful play zones, dedicated support staff, healthy dining spaces, and safe school transport.":s.includes("media")||s.includes("production")||s.includes("photography")||s.includes("videography")||s.includes("podcast")?"Ansar Media and Production is the school's in-house media unit. It supports photography, videography, drone videography, podcasts, graphic designing, editing, event documentation, reels, social media creatives, and institutional presentations. You can find it under Explore > Ansar Media and Production.":s.includes("website")||s.includes("site")||s.includes("navigate")||s.includes("page")?"This website is organized to help visitors learn about Ansar English School and quickly reach important information. The main sections include About, Academics, Admission, News, Events, Gallery, Achievements, Ansar Times, Mandatory Public Disclosure, Contact, and special pages such as Sports, ATL, Ansar Sprouts, Life at Ansar, and Ansar Media and Production. Use the navigation menu for general pages, News and Events for updates by date, Achievements for student accomplishments, and Contact for phone, email, address, map, and inquiries.":s.includes("news")||s.includes("event")||s.includes("achievement")?"The latest school updates are available in News, Events, and Achievements. I can guide you to the relevant page from the shortcuts below.":n.length?`I can guide you to ${n.map(a=>a.label).join(", ")}. Please choose one of the links below.`:"Good day. I can help with detailed information about Ansar English School, the institution history, leadership, facilities, admissions, academics, website navigation, news, events, achievements, public disclosure documents, Ansar Times, and contact information. Please ask your question in a little more detail."}function qt(){const e=Me(),[t,n]=N.useState(!1),[s,a]=N.useState(""),[i,o]=N.useState(!1),[c,l]=N.useState([{role:"assistant",text:"Good day. Welcome to Ansar English School. I can explain the institution, leadership, website sections, admissions, academics, news, events, achievements, public disclosures, Ansar Times, and contact details. How may I assist you?"}]),d=N.useRef([]),{data:E}=D("updates",null),{data:f}=D("achievements",null),{data:A}=D("publicDisclosure","order","asc",{limit:12}),{data:r}=D("ansarTimes","year","desc",{limit:8}),{data:m}=D("leadership","order","asc",{firestoreOnly:!0}),{data:P}=xe("pages","createdAt","desc"),L=N.useMemo(()=>Ut({settings:e,updates:E,achievements:f,disclosures:A,ansarTimes:r,pages:P,leadership:m}),[e,E,f,A,r,P,m]),Re=N.useMemo(()=>{var v;const g=((v=[...c].reverse().find(C=>C.role==="user"))==null?void 0:v.text)||"",y=Ce(g);return y.length?y:te.slice(0,4)},[c]),ne=async g=>{const y=g.trim();if(!y||i)return;const v={role:"user",text:y};l(C=>[...C,v]),a(""),o(!0);try{const C=jt(y),j=vt(xt,{model:Pt,generationConfig:{maxOutputTokens:C?900:420}}),F=[...d.current,v].slice(-8),_e=["You are the formal, helpful website assistant for Ansar English School.","Answer only from the provided website/admin/sheet context. If information is missing, say so and guide the visitor to Contact.",C?"For questions about the institution, leadership, history, facilities, or website navigation, give a detailed, well-structured answer in 2 to 5 short paragraphs. Include relevant facts, names, milestones, page names, and helpful next steps from the context.":"Keep replies concise, polite, and navigation-oriented. Mention relevant page names and paths when useful.","Do not answer in one line when the visitor asks to explain the institution, leaders, or website. Use clear headings or short paragraphs when that makes the answer easier to read.","Do not invent dates, fees, phone numbers, or policies.",`Website context:
${L}`,`Conversation:
${F.map(G=>`${G.role}: ${G.text}`).join(`
`)}`,`Visitor question: ${y}`].join(`

`),se={role:"assistant",text:(await j.generateContent(_e)).response.text().trim()||me(y,L)};d.current=[...F,se].slice(-8),l(G=>[...G,se])}catch(C){console.warn("AI assistant unavailable, using guided fallback.",C);const j={role:"assistant",text:me(y)};d.current=[...d.current,v,j].slice(-8),l(F=>[...F,j])}finally{o(!1)}},Ne=g=>{g.preventDefault(),ne(s)};return p.jsxs("div",{className:"fixed bottom-5 left-5 z-[9998]",children:[t&&p.jsxs("section",{className:"mb-4 flex h-[min(76vh,38rem)] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl",children:[p.jsxs("header",{className:"flex items-center justify-between bg-emerald-950 px-4 py-3 text-white",children:[p.jsxs("div",{className:"flex min-w-0 items-center gap-3",children:[p.jsx("span",{className:"flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber-400 text-emerald-950",children:p.jsx("svg",{className:"h-5 w-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:p.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 6V4m0 16v-2m6-6h2M4 12h2m9.9-5.9 1.4-1.4M6.7 17.3l1.4-1.4m9.2 1.4-1.4-1.4M6.7 6.7l1.4 1.4M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"})})}),p.jsxs("div",{className:"min-w-0",children:[p.jsx("h2",{className:"truncate text-sm font-extrabold",children:"Ansar AI Assistant"}),p.jsx("p",{className:"truncate text-xs text-emerald-100",children:"Website guidance"})]})]}),p.jsx("button",{type:"button",onClick:()=>n(!1),className:"rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white","aria-label":"Close assistant",children:p.jsx("svg",{className:"h-5 w-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:p.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18 18 6M6 6l12 12"})})})]}),p.jsxs("div",{className:"flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4",children:[c.map((g,y)=>p.jsx("div",{className:`flex ${g.role==="user"?"justify-end":"justify-start"}`,children:p.jsx("div",{className:`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${g.role==="user"?"bg-emerald-600 text-white":"bg-white text-slate-700 border border-slate-100"}`,children:g.text})},`${g.role}-${y}`)),i&&p.jsxs("div",{className:"inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm",children:[p.jsx("span",{className:"h-2 w-2 animate-pulse rounded-full bg-emerald-500"}),"Preparing a response"]})]}),p.jsxs("div",{className:"border-t border-slate-100 bg-white p-3",children:[p.jsx("div",{className:"mb-3 flex gap-2 overflow-x-auto pb-1",children:Re.map(g=>p.jsx(Pe,{to:g.path,onClick:()=>n(!1),className:"whitespace-nowrap rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100",children:g.label},g.path))}),p.jsx("div",{className:"mb-3 grid grid-cols-2 gap-2",children:Lt.slice(0,4).map(g=>p.jsx("button",{type:"button",onClick:()=>ne(g),className:"rounded-lg bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200",children:g},g))}),p.jsxs("form",{onSubmit:Ne,className:"flex items-center gap-2",children:[p.jsx("input",{type:"text",value:s,onChange:g=>a(g.target.value),placeholder:"Ask about the school...",className:"min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-emerald-400 focus:bg-white"}),p.jsx("button",{type:"submit",disabled:i||!s.trim(),className:"flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50","aria-label":"Send message",children:p.jsx("svg",{className:"h-5 w-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:p.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M5 12h14m-6-6 6 6-6 6"})})})]})]})]}),p.jsx("button",{type:"button",onClick:()=>n(g=>!g),className:"flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-white shadow-2xl ring-4 ring-white transition-all hover:-translate-y-1 hover:bg-emerald-800","aria-label":t?"Close Ansar AI Assistant":"Open Ansar AI Assistant",children:p.jsx("svg",{className:"h-7 w-7",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:p.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M8 10h.01M12 10h.01M16 10h.01M9 16H7a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-3l-4 4v-4H9Z"})})})]})}export{qt as default};
