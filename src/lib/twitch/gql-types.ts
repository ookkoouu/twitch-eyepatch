export type GqlQuery = {
	user: GqlUser;
	currentUser: GqlUser;
};

export type GqlUser = {
	id: string;
	displayName: string;
	login: string;
	blockedUsers: GqlUser[];
	relationship: GqlUserRelationship;
	createdAt: string;
};

export type GqlUserRelationship = {
	followedAt: string;
	subscriptionBenefit: GqlSubscriptionBenefit;
	subscriptionTenure: GqlSubscriptionTenure;
};
export type GqlSubscriptionBenefit = {
	endsAt: string;
	gift: GqlSubscriptionGift;
	id: string;
	purchasedWithPrime: boolean;
	renewsAt: string;
	tier: string;
	user: GqlUser;
};
export type GqlSubscriptionGift = {
	isGift: boolean;
	giftDate: string;
	gifter: GqlUser;
};
export type GqlSubscriptionTenure = Record<string, unknown>;

export type GqlBlockUserResp = {
	blockUser: {
		targetUser: GqlUser;
	};
};
export type GqlUnblockUserResp = {
	unblockUser: {
		targetUser: GqlUser;
	};
};
