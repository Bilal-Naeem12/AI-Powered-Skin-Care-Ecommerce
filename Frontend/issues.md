# Frontend audit

Audit started 2026-09-27. Scope: this frontend's source, configuration, dependency graph, routes, shared hooks and stores. Findings below distinguish confirmed code defects from integration risks. A finite source review cannot prove that every possible bug has been found; backend authorization, real camera hardware, production configuration and live payment/order contracts require separate verification. Existing user changes to ProductInfo.tsx and the dependency manifests were present before this audit.

## Confirmed findings (initial inventory, before pnpm migration)

| ID | Severity | Location | Failure and required correction |
|---|---|---|---|
| F01 | High | ProductInfo.tsx and nested response consumers | Optional chaining on the parent alone does not protect missing category, images, address, shippingAddress or nested lists. A deleted/unpopulated relation can crash rendering. The user's category change is already present; extend guards and give an explicit fallback. |
| F02 | High | OnboardingModal.tsx: handleFinishOnboarding | Skip advances past face capture, but Finish returns early when faceImage is null. Make upload conditional on opting into capture; complete the walkthrough without a face. |
| F03 | High | OnboardingModal.tsx | No submitting guard, failure only logged, user ID can be absent, and body scroll is locked even for an already-completed user. Prevent duplicate submissions, retain retry state, show an error and restore prior overflow. |
| F04 | High | UniversalCapture.tsx | Camera permission/model loading failures reject without UI handling. Async initialization can finish after unmount and leave a stream/model alive. Add cancellation checks and cleanup at every async boundary. |
| F05 | Medium | IngredientSelect.tsx | Fetch is typed as string[] but options reads .data; the computed safeIngredients is unused. Handle the actual array/envelope shapes and use a null value for single selection. |
| F06 | High | useFetchData.tsx, useFetchAuthData.tsx | Old requests can overwrite newer route data. Public hook retains prior errors after success. Abort obsolete requests, clear state and prevent obsolete authentication side effects. |
| F07 | High | usePostAuthData.tsx, BillingForm.tsx | POST failures are swallowed, so checkout still clears the cart and redirects after failed orders. Return an explicit success result and only clear after success. Overlay also never resets on failure. |
| F08 | High | BillingForm.tsx | OrderStore starts with an empty userId; checkout sends that value instead of current user ID. Empty carts and repeat submissions are not guarded. |
| F09 | High | router/AppRouter.tsx | ProtectedRoute checks user presence but not admin role for /admin. Add a role gate; backend must independently authorize every admin operation. Checkout also redirects before hydration is settled. |
| F10 | High | UserStore.tsx | JSON.parse of cached user is unguarded; malformed storage can prevent app initialization. isFirstLogin is not initialized; logout retains first-login/walkthrough state. |
| F11 | High | AuthStore.tsx | Invalid refresh token and request failures do not settle isCheckingToken/isRefreshTokenValid. Ensure failure state is set. |
| F12 | High | CartStore.tsx and cart consumers | Quantity accepts fractions/nonfinite values and can exceed stock; cart total uses undiscounted price. Persisted malformed items can crash consumers. Validate persisted entries and centralize price/quantity calculations. |
| F13 | Medium | ProductInfo.tsx | Variant state initializes before fetch completes, selection is not passed to cart, and image index/quantity survive product navigation. Reset on product change; carry selected variant through cart/order. |
| F14 | Medium | ProductInfo.tsx | Failed/missing product renders a largely empty purchasing screen; optional createdAt is asserted and displays Invalid Date. Render explicit loading/error/not-found and safe date fallback. |
| F15 | High | package.json, eslint.config.js | Build does not run TypeScript and ESLint scans only JS/JSX. Baseline lint: 24 errors; typecheck also fails across application and library declarations. Add enforceable TS checks and regression coverage. |
| F16 | High | admin form examples | Broken relative imports for ComponentCard/icons; react-dropzone is imported but undeclared. Correct paths and declare dependencies. |
| F17 | Medium | dependencies, tsconfig.json | Router v5 type package conflicts with Router v7; obsolete Axios types interfere with modern Axios; legacy module resolution cannot resolve package exports. MUI Lab major mismatches Material. Align dependencies and use bundler resolution. |
| F18 | Medium | date picker consumers | Removed inputFormat/renderInput props are used with current MUI date pickers. Use format and slotProps. |
| F19 | Medium | types/CartItem.tsx, Order.tsx, notifications and charts | Types disagree with actual store/render shapes, notification read-state additions omit fields, and chart fallback mutates input. Fix contracts rather than disable strict null checking. |
| F20 | Medium | ProfileHeaderAndInfo.jsx | Save calls undefined dispatch/updateUser. Replace with the existing authenticated update mechanism or remove unsupported action. |
| F21 | Medium | tailwind.config.js | defaultTheme is referenced without import. |
| F22 | Medium | object URL consumers | Inpainting preview and review image picker create blob URLs during render without releasing them. Other image upload/preview components require lifecycle review. |
| F23 | Medium | SkinAnalysis.tsx | Nested detections and routine/products are assumed populated; missing data can crash the workflow. History can be sent with empty user ID. |
| F24 | Medium | router/AppRouter.tsx | Diagnostic/test routes and product upload UI are exposed in production. Restrict diagnostic routes to development and upload UI to admin. |
| F25 | Medium | SkinAnalysis/Inpainting/Recommendation stores | Personal scan results persist on shared browsers and are not cleared on logout. Clear personal state when ending a session. |
| F26 | Medium | README.md, package manager | README is an untouched Vite template. No pnpm lock or pinned package manager. Document setup, environment and checks; migrate only after this inventory exists. |

## Integration risks and acceptance checks

- Optional face capture: confirm backend walkthrough endpoint accepts completion without a stored face. Test Skip → allergens → Finish, captured image → Finish, upload failure → retry, and double-click Finish.
- Authentication: localStorage user/role is an untrusted UI cache, never authorization. Verify cookie/session expiry, permission-denied behavior, concurrent refresh requests and backend role enforcement.
- Orders: backend must calculate authoritative prices, enforce stock and validate ownership; frontend values are untrusted. Verify failed POST preserves cart and success creates exactly one order. Backend idempotency cannot be supplied by frontend alone without a contract.
- Product relations: test null category, absent images/address/shipping, deleted products, empty reviews and unavailable stock.
- Camera: test deny permission, missing camera, CDN/model failure, Skip while permission prompt is open, mobile orientation and recapture.
- Dependencies: run fresh pnpm install, typecheck, lint, tests and production build; report warnings separately from failures.
- Environment: verify API URLs, cookie CORS and deployed SPA rewrites. This repository alone cannot validate remote service availability or contracts.

## Validation and resolution log

This section is updated as fixes and checks finish. The inventory above records original behavior, not a claim that every item remains open.
