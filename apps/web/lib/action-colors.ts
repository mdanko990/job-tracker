export const ACTION_TEXT_CLASS: Record<string, string> = {
  PEER_CONNECTION: "text-white",
  HR_CONNECTION: "text-white",
  PEER_MESSAGE: "text-neutral-900",
  HR_MESSAGE: "text-white",
  EMAIL_SENT: "text-white",
  EMAIL_RECEIVED: "text-neutral-900",
  CONFIRMATION_RECEIVED: "text-white",
  INVITATION_RECEIVED: "text-neutral-900",
  INVITATION_ACCEPTED: "text-white",
  PHONE_CALL: "text-white",
  VIDEO_CALL: "text-white",
  TAKE_HOME_SUBMITTED: "text-white",
  FOLLOW_UP_SENT: "text-neutral-900",
  OFFER_RECEIVED: "text-neutral-900",
  OTHER: "text-neutral-900",
};

export function getActionTextClass(actionType: string) {
  return ACTION_TEXT_CLASS[actionType] ?? "text-neutral-900";
}

export const ACTION_CHIP_CLASS: Record<string, string> = {
  PEER_CONNECTION: "bg-action-peer-connection",
  HR_CONNECTION: "bg-action-hr-connection",
  PEER_MESSAGE: "bg-action-peer-message",
  HR_MESSAGE: "bg-action-hr-message",
  EMAIL_SENT: "bg-action-email-sent",
  EMAIL_RECEIVED: "bg-action-email-received",
  CONFIRMATION_RECEIVED: "bg-action-confirmation-received",
  INVITATION_RECEIVED: "bg-action-invitation-received",
  INVITATION_ACCEPTED: "bg-action-invitation-accepted",
  PHONE_CALL: "bg-action-phone-call",
  VIDEO_CALL: "bg-action-video-call",
  TAKE_HOME_SUBMITTED: "bg-action-take-home-submitted",
  FOLLOW_UP_SENT: "bg-action-follow-up-sent",
  OFFER_RECEIVED: "bg-action-offer-received",
  OTHER: "bg-action-other",
};

export function getActionChipClass(actionType: string) {
  return ACTION_CHIP_CLASS[actionType] ?? "bg-action-other";
}
