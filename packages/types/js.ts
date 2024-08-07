import { z } from "zod";
import { ZActionClass } from "./action-classes";
import { ZAttributes } from "./attributes";
import { ZLegacySurvey } from "./legacy-surveys";
import { ZPerson } from "./people";
import { ZProduct } from "./product";
import { ZResponseHiddenFieldValue } from "./responses";
import { ZSurvey } from "./surveys/types";

export const ZJsPerson = z.object({
  id: z.string().cuid2().optional(),
  userId: z.string().optional(),
});

export type TJsPerson = z.infer<typeof ZJsPerson>;

// ZSurvey is a refinement, so to extend it to ZSurveyWithTriggers, we need to extend the innerType and then apply the same refinements.
const ZSurveyWithTriggers = ZSurvey.innerType()
  .extend({
    triggers: z.array(ZActionClass).or(z.array(z.string())),
  })
  .superRefine(ZSurvey._def.effect.type === "refinement" ? ZSurvey._def.effect.refinement : () => null);

export type TSurveyWithTriggers = z.infer<typeof ZSurveyWithTriggers>;

export const ZJSWebsiteStateDisplay = z.object({
  createdAt: z.date(),
  surveyId: z.string().cuid(),
  responded: z.boolean(),
});

export type TJSWebsiteStateDisplay = z.infer<typeof ZJSWebsiteStateDisplay>;

export const ZJsAppStateSync = z.object({
  person: ZJsPerson.nullish(),
  userId: z.string().optional(),
  surveys: z.union([z.array(ZSurvey), z.array(ZLegacySurvey)]),
  actionClasses: z.array(ZActionClass),
  product: ZProduct,
  language: z.string().optional(),
});

export type TJsAppStateSync = z.infer<typeof ZJsAppStateSync>;

export const ZJsWebsiteStateSync = ZJsAppStateSync.omit({ person: true });

export type TJsWebsiteStateSync = z.infer<typeof ZJsWebsiteStateSync>;

export const ZJsAppState = z.object({
  attributes: ZAttributes,
  surveys: z.array(ZSurvey),
  actionClasses: z.array(ZActionClass),
  product: ZProduct,
});

export type TJsAppState = z.infer<typeof ZJsAppState>;

export const ZJsWebsiteState = z.object({
  surveys: z.array(ZSurvey),
  actionClasses: z.array(ZActionClass),
  product: ZProduct,
  displays: z.array(ZJSWebsiteStateDisplay),
  attributes: ZAttributes.optional(),
});

export type TJsWebsiteState = z.infer<typeof ZJsWebsiteState>;

export const ZJsAppLegacyStateSync = z.object({
  person: ZJsPerson.nullish(),
  userId: z.string().optional(),
  surveys: z.union([z.array(ZSurvey), z.array(ZLegacySurvey)]),
  noCodeActionClasses: z.array(ZActionClass),
  product: ZProduct,
  language: z.string().optional(),
});

export type TJsAppLegacyStateSync = z.infer<typeof ZJsAppLegacyStateSync>;

export const ZJsWebsiteLegacyStateSync = ZJsAppLegacyStateSync.omit({ person: true });

export type TJsWebsiteLegacyStateSync = z.infer<typeof ZJsWebsiteLegacyStateSync>;

export const ZJsLegacyState = z.object({
  person: ZPerson.nullable().or(z.object({})),
  session: z.object({}),
  surveys: z.array(ZSurveyWithTriggers),
  noCodeActionClasses: z.array(ZActionClass),
  product: ZProduct,
  displays: z.array(ZJSWebsiteStateDisplay).optional(),
});

export type TJsLegacyState = z.infer<typeof ZJsLegacyState>;

export const ZJsWebsiteSyncInput = z.object({
  environmentId: z.string().cuid(),
  version: z.string().optional(),
});

export type TJsWebsiteSyncInput = z.infer<typeof ZJsWebsiteSyncInput>;

export const ZJsWebsiteConfig = z.object({
  environmentId: z.string().cuid(),
  apiHost: z.string(),
  state: ZJsWebsiteState,
  expiresAt: z.date(),
  status: z.enum(["success", "error"]).optional(),
});

export type TJsWebsiteConfig = z.infer<typeof ZJsWebsiteConfig>;

export const ZJSAppConfig = z.object({
  environmentId: z.string().cuid(),
  apiHost: z.string(),
  userId: z.string(),
  state: ZJsAppState,
  expiresAt: z.date(),
  status: z.enum(["success", "error"]).optional(),
});

export type TJSAppConfig = z.infer<typeof ZJSAppConfig>;

export const ZJsWebsiteConfigUpdateInput = z.object({
  environmentId: z.string().cuid(),
  apiHost: z.string(),
  state: ZJsWebsiteState,
  expiresAt: z.date(),
  status: z.enum(["success", "error"]).optional(),
});

export type TJsWebsiteConfigUpdateInput = z.infer<typeof ZJsWebsiteConfigUpdateInput>;

export const ZJsAppConfigUpdateInput = z.object({
  environmentId: z.string().cuid(),
  apiHost: z.string(),
  userId: z.string(),
  state: ZJsAppState,
  expiresAt: z.date(),
  status: z.enum(["success", "error"]).optional(),
});

export type TJsAppConfigUpdateInput = z.infer<typeof ZJsAppConfigUpdateInput>;

export const ZJsWebsiteConfigInput = z.object({
  environmentId: z.string().cuid(),
  apiHost: z.string(),
  errorHandler: z.function().args(z.any()).returns(z.void()).optional(),
  attributes: z.record(z.string()).optional(),
});

export type TJsWebsiteConfigInput = z.infer<typeof ZJsWebsiteConfigInput>;

export const ZJsAppConfigInput = z.object({
  environmentId: z.string().cuid(),
  apiHost: z.string(),
  errorHandler: z.function().args(z.any()).returns(z.void()).optional(),
  userId: z.string(),
  attributes: z.record(z.string()).optional(),
});

export type TJsAppConfigInput = z.infer<typeof ZJsAppConfigInput>;

export const ZJsPeopleUserIdInput = z.object({
  environmentId: z.string().cuid(),
  userId: z.string().min(1).max(255),
  version: z.string().optional(),
});

export const ZJsPeopleUpdateAttributeInput = z.object({
  attributes: ZAttributes,
});

export type TJsPeopleUpdateAttributeInput = z.infer<typeof ZJsPeopleUpdateAttributeInput>;

export type TJsPeopleUserIdInput = z.infer<typeof ZJsPeopleUserIdInput>;

export const ZJsPeopleAttributeInput = z.object({
  key: z.string(),
  value: z.string(),
});

export type TJsPeopleAttributeInput = z.infer<typeof ZJsPeopleAttributeInput>;

export const ZJsPeopleLegacyAttributeInput = z.object({
  environmentId: z.string().cuid(),
  key: z.string(),
  value: z.string(),
});

export type TJsPeopleLegacyAttributeInput = z.infer<typeof ZJsPeopleLegacyAttributeInput>;

export const ZJsActionInput = z.object({
  environmentId: z.string().cuid(),
  userId: z.string().optional(),
  name: z.string(),
});

export type TJsActionInput = z.infer<typeof ZJsActionInput>;

export const ZJsWesbiteActionInput = ZJsActionInput.omit({ userId: true });

export type TJsWesbiteActionInput = z.infer<typeof ZJsWesbiteActionInput>;

export const ZJsAppSyncParams = z.object({
  environmentId: z.string().cuid(),
  apiHost: z.string(),
  userId: z.string(),
  attributes: ZAttributes.optional(),
});

export type TJsAppSyncParams = z.infer<typeof ZJsAppSyncParams>;

export const ZJsWebsiteSyncParams = ZJsAppSyncParams.omit({ userId: true });

export type TJsWebsiteSyncParams = z.infer<typeof ZJsWebsiteSyncParams>;

export const ZJsPackageType = z.union([z.literal("app"), z.literal("website")]);

export type TJsPackageType = z.infer<typeof ZJsPackageType>;

export const ZJsTrackProperties = z.object({
  hiddenFields: ZResponseHiddenFieldValue.optional(),
});

export type TJsTrackProperties = z.infer<typeof ZJsTrackProperties>;
