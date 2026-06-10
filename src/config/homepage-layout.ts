import { normalizeHost } from "./tenant-branding";

export type HomepageStyleProps = {
	background: {
		mode: "none" | "token" | "image" | "custom";
		token?: "background" | "card" | "muted" | "secondary" | "accent";
		color?: string;
		imageUrl?: string;
	};
	container: {
		width: "full" | "boxed";
		maxWidth: "sm" | "md" | "lg" | "xl";
	};
	spacing: {
		top: "none" | "sm" | "md" | "lg";
		bottom: "none" | "sm" | "md" | "lg";
	};
	alignment: "left" | "center";
	shape: {
		radius: "none" | "sm" | "md" | "lg";
		shadow: "none" | "sm" | "md" | "lg";
	};
	textColor?: string;
	minHeight?: number;
	paddingX?: number;
	paddingY?: number;
};

export type HomepageFeaturedProductsSection = {
	type: "featured-products";
	heading?: string;
	collectionSlug?: string;
	limit?: number;
	style?: HomepageStyleProps;
};

export type HomepageHeroSection = {
	type: "hero";
	eyebrow?: string;
	title: string;
	subtitle?: string;
	ctaLabel?: string;
	ctaHref?: string;
	backgroundColor?: string;
	backgroundImageUrl?: string;
	textColor?: string;
	contentAlign?: "left" | "center";
	widthMode?: "narrow" | "normal" | "wide" | "full";
	minHeight?: number;
	paddingX?: number;
	paddingY?: number;
	titleSize?: "lg" | "xl" | "2xl";
	buttonVariant?: "solid" | "outline";
	buttonSize?: "sm" | "md" | "lg";
	style?: HomepageStyleProps;
};

export type HomepageRichTextSection = {
	type: "rich-text";
	heading?: string;
	body?: string;
	style?: HomepageStyleProps;
};

export type HomepageHeadingSection = {
	type: "heading";
	eyebrow?: string;
	title: string;
	subtitle?: string;
	ctaLabel?: string;
	ctaHref?: string;
	titleSize?: "md" | "lg" | "xl";
	style?: HomepageStyleProps;
};

export type HomepageImageBannerSection = {
	type: "image-banner";
	eyebrow?: string;
	heading?: string;
	body?: string;
	imageUrl?: string;
	imageAlt?: string;
	imageFit?: "cover" | "contain";
	imagePosition?: "left" | "right" | "top";
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageIconListSection = {
	type: "icon-list";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	item1Icon?: string;
	item1Title?: string;
	item1Description?: string;
	item2Icon?: string;
	item2Title?: string;
	item2Description?: string;
	item3Icon?: string;
	item3Title?: string;
	item3Description?: string;
	item4Icon?: string;
	item4Title?: string;
	item4Description?: string;
	style?: HomepageStyleProps;
};

export type HomepageFaqAccordionSection = {
	type: "faq-accordion";
	heading?: string;
	subtitle?: string;
	q1Question?: string;
	q1Answer?: string;
	q2Question?: string;
	q2Answer?: string;
	q3Question?: string;
	q3Answer?: string;
	q4Question?: string;
	q4Answer?: string;
	q5Question?: string;
	q5Answer?: string;
	style?: HomepageStyleProps;
};

export type HomepageFeaturedCollectionsSection = {
	type: "featured-collections";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	collectionSlug1?: string;
	collectionSlug2?: string;
	collectionSlug3?: string;
	collectionSlug4?: string;
	style?: HomepageStyleProps;
};

export type HomepagePromoBannerSection = {
	type: "promo-banner";
	eyebrow?: string;
	title?: string;
	subtitle?: string;
	badgeText?: string;
	ctaLabel?: string;
	ctaHref?: string;
	secondaryCtaLabel?: string;
	secondaryCtaHref?: string;
	scheduleMode?: "always" | "window";
	scheduleStartIso?: string;
	scheduleEndIso?: string;
	style?: HomepageStyleProps;
};

export type HomepageTestimonialsSection = {
	type: "testimonials";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	item1Quote?: string;
	item1Author?: string;
	item1Role?: string;
	item1AvatarUrl?: string;
	item2Quote?: string;
	item2Author?: string;
	item2Role?: string;
	item2AvatarUrl?: string;
	item3Quote?: string;
	item3Author?: string;
	item3Role?: string;
	item3AvatarUrl?: string;
	style?: HomepageStyleProps;
};

export type HomepageStorePoliciesSection = {
	type: "store-policies";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	policy1Label?: string;
	policy1Href?: string;
	policy1Description?: string;
	policy2Label?: string;
	policy2Href?: string;
	policy2Description?: string;
	policy3Label?: string;
	policy3Href?: string;
	policy3Description?: string;
	policy4Label?: string;
	policy4Href?: string;
	policy4Description?: string;
	style?: HomepageStyleProps;
};

export type HomepageCategoryGridSection = {
	type: "category-grid";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	categorySlug1?: string;
	categoryLabel1?: string;
	categorySlug2?: string;
	categoryLabel2?: string;
	categorySlug3?: string;
	categoryLabel3?: string;
	categorySlug4?: string;
	categoryLabel4?: string;
	categorySlug5?: string;
	categoryLabel5?: string;
	categorySlug6?: string;
	categoryLabel6?: string;
	style?: HomepageStyleProps;
};

export type HomepageProductSpotlightSection = {
	type: "product-spotlight";
	heading?: string;
	subtitle?: string;
	badgeText?: string;
	productSlug?: string;
	productName?: string;
	priceText?: string;
	imageUrl?: string;
	imageAlt?: string;
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageCountdownSection = {
	type: "countdown";
	heading?: string;
	subtitle?: string;
	targetIso?: string;
	timezoneLabel?: string;
	expiredMessage?: string;
	mode?: "always" | "hide-after-expired";
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageFeaturedCategoriesAutoSection = {
	type: "featured-categories-auto";
	heading?: string;
	subtitle?: string;
	mode?: "auto" | "manual";
	autoLimit?: number;
	columns?: 2 | 3 | 4;
	manualCategorySlug1?: string;
	manualCategoryLabel1?: string;
	manualCategorySlug2?: string;
	manualCategoryLabel2?: string;
	manualCategorySlug3?: string;
	manualCategoryLabel3?: string;
	manualCategorySlug4?: string;
	manualCategoryLabel4?: string;
	manualCategorySlug5?: string;
	manualCategoryLabel5?: string;
	manualCategorySlug6?: string;
	manualCategoryLabel6?: string;
	style?: HomepageStyleProps;
};

export type HomepageLogoCloudSection = {
	type: "logo-cloud";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	logo1Url?: string;
	logo1Alt?: string;
	logo2Url?: string;
	logo2Alt?: string;
	logo3Url?: string;
	logo3Alt?: string;
	logo4Url?: string;
	logo4Alt?: string;
	logo5Url?: string;
	logo5Alt?: string;
	logo6Url?: string;
	logo6Alt?: string;
	style?: HomepageStyleProps;
};

export type HomepageTimelineStepsSection = {
	type: "timeline-steps";
	heading?: string;
	subtitle?: string;
	step1Title?: string;
	step1Description?: string;
	step2Title?: string;
	step2Description?: string;
	step3Title?: string;
	step3Description?: string;
	step4Title?: string;
	step4Description?: string;
	style?: HomepageStyleProps;
};

export type HomepageCollectionHeroSection = {
	type: "collection-hero";
	eyebrow?: string;
	heading?: string;
	subtitle?: string;
	collectionSlug?: string;
	collectionLabel?: string;
	backgroundImageUrl?: string;
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageContactQuickActionsSection = {
	type: "contact-quick-actions";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	action1Label?: string;
	action1Value?: string;
	action1Href?: string;
	action1Description?: string;
	action2Label?: string;
	action2Value?: string;
	action2Href?: string;
	action2Description?: string;
	action3Label?: string;
	action3Value?: string;
	action3Href?: string;
	action3Description?: string;
	action4Label?: string;
	action4Value?: string;
	action4Href?: string;
	action4Description?: string;
	style?: HomepageStyleProps;
};

export type HomepageStatsCounterSection = {
	type: "stats-counter";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	item1Label?: string;
	item1Value?: string;
	item1Suffix?: string;
	item2Label?: string;
	item2Value?: string;
	item2Suffix?: string;
	item3Label?: string;
	item3Value?: string;
	item3Suffix?: string;
	item4Label?: string;
	item4Value?: string;
	item4Suffix?: string;
	style?: HomepageStyleProps;
};

export type HomepageCardGridSection = {
	type: "card-grid";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	card1Title?: string;
	card1Body?: string;
	card1CtaLabel?: string;
	card1CtaHref?: string;
	card2Title?: string;
	card2Body?: string;
	card2CtaLabel?: string;
	card2CtaHref?: string;
	card3Title?: string;
	card3Body?: string;
	card3CtaLabel?: string;
	card3CtaHref?: string;
	card4Title?: string;
	card4Body?: string;
	card4CtaLabel?: string;
	card4CtaHref?: string;
	card5Title?: string;
	card5Body?: string;
	card5CtaLabel?: string;
	card5CtaHref?: string;
	card6Title?: string;
	card6Body?: string;
	card6CtaLabel?: string;
	card6CtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageNewsletterSignupSection = {
	type: "newsletter-signup";
	heading?: string;
	subtitle?: string;
	inputPlaceholder?: string;
	buttonLabel?: string;
	privacyNote?: string;
	actionHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageVideoEmbedSection = {
	type: "video-embed";
	heading?: string;
	subtitle?: string;
	videoUrl?: string;
	posterImageUrl?: string;
	aspectRatio?: "16-9" | "4-3" | "1-1";
	style?: HomepageStyleProps;
};

export type HomepageAnnouncementBarSection = {
	type: "announcement-bar";
	message?: string;
	ctaLabel?: string;
	ctaHref?: string;
	scheduleMode?: "always" | "window";
	scheduleStartIso?: string;
	scheduleEndIso?: string;
	dismissMode?: "fixed" | "dismissible";
	style?: HomepageStyleProps;
};

export type HomepageTrustBadgesSection = {
	type: "trust-badges";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	badge1Icon?: string;
	badge1Title?: string;
	badge1Description?: string;
	badge2Icon?: string;
	badge2Title?: string;
	badge2Description?: string;
	badge3Icon?: string;
	badge3Title?: string;
	badge3Description?: string;
	badge4Icon?: string;
	badge4Title?: string;
	badge4Description?: string;
	badge5Icon?: string;
	badge5Title?: string;
	badge5Description?: string;
	badge6Icon?: string;
	badge6Title?: string;
	badge6Description?: string;
	style?: HomepageStyleProps;
};

export type HomepageContactFormLiteSection = {
	type: "contact-form-lite";
	heading?: string;
	subtitle?: string;
	namePlaceholder?: string;
	emailPlaceholder?: string;
	messagePlaceholder?: string;
	submitLabel?: string;
	actionHref?: string;
	privacyNote?: string;
	style?: HomepageStyleProps;
};

export type HomepageTabsContentSection = {
	type: "tabs-content";
	heading?: string;
	subtitle?: string;
	defaultTab?: 1 | 2 | 3 | 4;
	tab1Label?: string;
	tab1Body?: string;
	tab2Label?: string;
	tab2Body?: string;
	tab3Label?: string;
	tab3Body?: string;
	tab4Label?: string;
	tab4Body?: string;
	style?: HomepageStyleProps;
};

export type HomepageBeforeAfterSection = {
	type: "before-after";
	heading?: string;
	subtitle?: string;
	layout?: "horizontal" | "vertical";
	beforeLabel?: string;
	beforeImageUrl?: string;
	beforeImageAlt?: string;
	afterLabel?: string;
	afterImageUrl?: string;
	afterImageAlt?: string;
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageSocialProofFeedSection = {
	type: "social-proof-feed";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	item1Quote?: string;
	item1Author?: string;
	item1Meta?: string;
	item1ImageUrl?: string;
	item2Quote?: string;
	item2Author?: string;
	item2Meta?: string;
	item2ImageUrl?: string;
	item3Quote?: string;
	item3Author?: string;
	item3Meta?: string;
	item3ImageUrl?: string;
	item4Quote?: string;
	item4Author?: string;
	item4Meta?: string;
	item4ImageUrl?: string;
	style?: HomepageStyleProps;
};

export type HomepageFaqCompactSection = {
	type: "faq-compact";
	heading?: string;
	subtitle?: string;
	q1?: string;
	a1?: string;
	q2?: string;
	a2?: string;
	q3?: string;
	a3?: string;
	q4?: string;
	a4?: string;
	q5?: string;
	a5?: string;
	q6?: string;
	a6?: string;
	style?: HomepageStyleProps;
};

export type HomepageMetricCardsSection = {
	type: "metric-cards";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	item1Icon?: string;
	item1Label?: string;
	item1Value?: string;
	item1Delta?: string;
	item2Icon?: string;
	item2Label?: string;
	item2Value?: string;
	item2Delta?: string;
	item3Icon?: string;
	item3Label?: string;
	item3Value?: string;
	item3Delta?: string;
	item4Icon?: string;
	item4Label?: string;
	item4Value?: string;
	item4Delta?: string;
	item5Icon?: string;
	item5Label?: string;
	item5Value?: string;
	item5Delta?: string;
	item6Icon?: string;
	item6Label?: string;
	item6Value?: string;
	item6Delta?: string;
	style?: HomepageStyleProps;
};

export type HomepageMediaTextSplitSection = {
	type: "media-text-split";
	eyebrow?: string;
	heading?: string;
	body?: string;
	layout?: "media-left" | "media-right";
	mediaType?: "image" | "video";
	imageUrl?: string;
	imageAlt?: string;
	videoUrl?: string;
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageQuoteHighlightSection = {
	type: "quote-highlight";
	quoteText?: string;
	authorName?: string;
	authorTitle?: string;
	backgroundImageUrl?: string;
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageFeatureComparisonSection = {
	type: "feature-comparison";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	plan1Name?: string;
	plan2Name?: string;
	plan3Name?: string;
	plan4Name?: string;
	row1Label?: string;
	row1Plan1?: string;
	row1Plan2?: string;
	row1Plan3?: string;
	row1Plan4?: string;
	row2Label?: string;
	row2Plan1?: string;
	row2Plan2?: string;
	row2Plan3?: string;
	row2Plan4?: string;
	row3Label?: string;
	row3Plan1?: string;
	row3Plan2?: string;
	row3Plan3?: string;
	row3Plan4?: string;
	row4Label?: string;
	row4Plan1?: string;
	row4Plan2?: string;
	row4Plan3?: string;
	row4Plan4?: string;
	style?: HomepageStyleProps;
};

export type HomepageInlineCtaBannerSection = {
	type: "inline-cta-banner";
	message?: string;
	ctaLabel?: string;
	ctaHref?: string;
	secondaryCtaLabel?: string;
	secondaryCtaHref?: string;
	compactMode?: "on" | "off";
	style?: HomepageStyleProps;
};

export type HomepageLogoStripCompactSection = {
	type: "logo-strip-compact";
	heading?: string;
	subtitle?: string;
	logo1Url?: string;
	logo1Alt?: string;
	logo1Href?: string;
	logo2Url?: string;
	logo2Alt?: string;
	logo2Href?: string;
	logo3Url?: string;
	logo3Alt?: string;
	logo3Href?: string;
	logo4Url?: string;
	logo4Alt?: string;
	logo4Href?: string;
	logo5Url?: string;
	logo5Alt?: string;
	logo5Href?: string;
	logo6Url?: string;
	logo6Alt?: string;
	logo6Href?: string;
	style?: HomepageStyleProps;
};

export type HomepageEventHighlightsSection = {
	type: "event-highlights";
	heading?: string;
	subtitle?: string;
	layout?: "timeline" | "cards";
	event1Date?: string;
	event1Title?: string;
	event1Description?: string;
	event2Date?: string;
	event2Title?: string;
	event2Description?: string;
	event3Date?: string;
	event3Title?: string;
	event3Description?: string;
	event4Date?: string;
	event4Title?: string;
	event4Description?: string;
	style?: HomepageStyleProps;
};

export type HomepageCtaCardPairSection = {
	type: "cta-card-pair";
	heading?: string;
	subtitle?: string;
	card1Title?: string;
	card1Body?: string;
	card1CtaLabel?: string;
	card1CtaHref?: string;
	card1ImageUrl?: string;
	card2Title?: string;
	card2Body?: string;
	card2CtaLabel?: string;
	card2CtaHref?: string;
	card2ImageUrl?: string;
	style?: HomepageStyleProps;
};

export type HomepageFaqWithCtaSection = {
	type: "faq-with-cta";
	heading?: string;
	subtitle?: string;
	q1?: string;
	a1?: string;
	q2?: string;
	a2?: string;
	q3?: string;
	a3?: string;
	q4?: string;
	a4?: string;
	ctaTitle?: string;
	ctaBody?: string;
	ctaLabel?: string;
	ctaHref?: string;
	ctaImageUrl?: string;
	style?: HomepageStyleProps;
};

export type HomepagePartnerMetricsSection = {
	type: "partner-metrics";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	item1LogoUrl?: string;
	item1LogoAlt?: string;
	item1Metric?: string;
	item1Label?: string;
	item2LogoUrl?: string;
	item2LogoAlt?: string;
	item2Metric?: string;
	item2Label?: string;
	item3LogoUrl?: string;
	item3LogoAlt?: string;
	item3Metric?: string;
	item3Label?: string;
	item4LogoUrl?: string;
	item4LogoAlt?: string;
	item4Metric?: string;
	item4Label?: string;
	style?: HomepageStyleProps;
};

export type HomepageStoryStepsSection = {
	type: "story-steps";
	heading?: string;
	subtitle?: string;
	layout?: "cards" | "timeline";
	step1Title?: string;
	step1Body?: string;
	step1ImageUrl?: string;
	step2Title?: string;
	step2Body?: string;
	step2ImageUrl?: string;
	step3Title?: string;
	step3Body?: string;
	step3ImageUrl?: string;
	step4Title?: string;
	step4Body?: string;
	step4ImageUrl?: string;
	style?: HomepageStyleProps;
};

export type HomepageMediaCarouselSection = {
	type: "media-carousel";
	heading?: string;
	subtitle?: string;
	autoplay?: "on" | "off";
	slide1ImageUrl?: string;
	slide1Title?: string;
	slide1Body?: string;
	slide1CtaLabel?: string;
	slide1CtaHref?: string;
	slide2ImageUrl?: string;
	slide2Title?: string;
	slide2Body?: string;
	slide2CtaLabel?: string;
	slide2CtaHref?: string;
	slide3ImageUrl?: string;
	slide3Title?: string;
	slide3Body?: string;
	slide3CtaLabel?: string;
	slide3CtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageFeatureChecklistSection = {
	type: "feature-checklist";
	heading?: string;
	subtitle?: string;
	item1?: string;
	item2?: string;
	item3?: string;
	item4?: string;
	item5?: string;
	item6?: string;
	item7?: string;
	item8?: string;
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageMiniBlogCardsSection = {
	type: "mini-blog-cards";
	heading?: string;
	subtitle?: string;
	card1Title?: string;
	card1Excerpt?: string;
	card1Href?: string;
	card1ImageUrl?: string;
	card2Title?: string;
	card2Excerpt?: string;
	card2Href?: string;
	card2ImageUrl?: string;
	card3Title?: string;
	card3Excerpt?: string;
	card3Href?: string;
	card3ImageUrl?: string;
	style?: HomepageStyleProps;
};

export type HomepageTrustLogoWallSection = {
	type: "trust-logo-wall";
	heading?: string;
	subtitle?: string;
	groupLabel?: string;
	density?: "normal" | "dense";
	logo1Url?: string;
	logo1Alt?: string;
	logo1Href?: string;
	logo2Url?: string;
	logo2Alt?: string;
	logo2Href?: string;
	logo3Url?: string;
	logo3Alt?: string;
	logo3Href?: string;
	logo4Url?: string;
	logo4Alt?: string;
	logo4Href?: string;
	logo5Url?: string;
	logo5Alt?: string;
	logo5Href?: string;
	logo6Url?: string;
	logo6Alt?: string;
	logo6Href?: string;
	logo7Url?: string;
	logo7Alt?: string;
	logo7Href?: string;
	logo8Url?: string;
	logo8Alt?: string;
	logo8Href?: string;
	style?: HomepageStyleProps;
};

export type HomepageDualHeroSplitSection = {
	type: "dual-hero-split";
	heading?: string;
	subtitle?: string;
	leftEyebrow?: string;
	leftTitle?: string;
	leftBody?: string;
	leftCtaLabel?: string;
	leftCtaHref?: string;
	leftImageUrl?: string;
	leftBackgroundColor?: string;
	rightEyebrow?: string;
	rightTitle?: string;
	rightBody?: string;
	rightCtaLabel?: string;
	rightCtaHref?: string;
	rightImageUrl?: string;
	rightBackgroundColor?: string;
	style?: HomepageStyleProps;
};

export type HomepageQuickLinksGridSection = {
	type: "quick-links-grid";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	link1Label?: string;
	link1Href?: string;
	link1Icon?: string;
	link2Label?: string;
	link2Href?: string;
	link2Icon?: string;
	link3Label?: string;
	link3Href?: string;
	link3Icon?: string;
	link4Label?: string;
	link4Href?: string;
	link4Icon?: string;
	link5Label?: string;
	link5Href?: string;
	link5Icon?: string;
	link6Label?: string;
	link6Href?: string;
	link6Icon?: string;
	link7Label?: string;
	link7Href?: string;
	link7Icon?: string;
	link8Label?: string;
	link8Href?: string;
	link8Icon?: string;
	style?: HomepageStyleProps;
};

export type HomepageStoreLocatorLiteSection = {
	type: "store-locator-lite";
	heading?: string;
	subtitle?: string;
	card1Name?: string;
	card1Address?: string;
	card1Phone?: string;
	card1Hours?: string;
	card1MapHref?: string;
	card2Name?: string;
	card2Address?: string;
	card2Phone?: string;
	card2Hours?: string;
	card2MapHref?: string;
	card3Name?: string;
	card3Address?: string;
	card3Phone?: string;
	card3Hours?: string;
	card3MapHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageTimelineCompactSection = {
	type: "timeline-compact";
	heading?: string;
	subtitle?: string;
	item1Date?: string;
	item1Title?: string;
	item1Body?: string;
	item2Date?: string;
	item2Title?: string;
	item2Body?: string;
	item3Date?: string;
	item3Title?: string;
	item3Body?: string;
	item4Date?: string;
	item4Title?: string;
	item4Body?: string;
	style?: HomepageStyleProps;
};

export type HomepageFaqCardsSection = {
	type: "faq-cards";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	q1?: string;
	a1?: string;
	q2?: string;
	a2?: string;
	q3?: string;
	a3?: string;
	q4?: string;
	a4?: string;
	q5?: string;
	a5?: string;
	q6?: string;
	a6?: string;
	style?: HomepageStyleProps;
};

export type HomepageProductComparisonLiteSection = {
	type: "product-comparison-lite";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	item1Name?: string;
	item1Price?: string;
	item1Feature?: string;
	item1CtaLabel?: string;
	item1CtaHref?: string;
	item2Name?: string;
	item2Price?: string;
	item2Feature?: string;
	item2CtaLabel?: string;
	item2CtaHref?: string;
	item3Name?: string;
	item3Price?: string;
	item3Feature?: string;
	item3CtaLabel?: string;
	item3CtaHref?: string;
	item4Name?: string;
	item4Price?: string;
	item4Feature?: string;
	item4CtaLabel?: string;
	item4CtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageCtaMarqueeSection = {
	type: "cta-marquee";
	message?: string;
	secondaryMessage?: string;
	ctaLabel?: string;
	ctaHref?: string;
	speed?: "slow" | "normal" | "fast";
	pauseOnHover?: "on" | "off";
	style?: HomepageStyleProps;
};

export type HomepageFaqAccordionPlusSection = {
	type: "faq-accordion-plus";
	heading?: string;
	subtitle?: string;
	group1Title?: string;
	q1?: string;
	a1?: string;
	q2?: string;
	a2?: string;
	group2Title?: string;
	q3?: string;
	a3?: string;
	q4?: string;
	a4?: string;
	group3Title?: string;
	q5?: string;
	a5?: string;
	q6?: string;
	a6?: string;
	style?: HomepageStyleProps;
};

export type HomepageUspPillRowSection = {
	type: "usp-pill-row";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	item1Icon?: string;
	item1Label?: string;
	item2Icon?: string;
	item2Label?: string;
	item3Icon?: string;
	item3Label?: string;
	item4Icon?: string;
	item4Label?: string;
	item5Icon?: string;
	item5Label?: string;
	item6Icon?: string;
	item6Label?: string;
	style?: HomepageStyleProps;
};

export type HomepagePricingCardLiteSection = {
	type: "pricing-card-lite";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	plan1Name?: string;
	plan1Price?: string;
	plan1Feature?: string;
	plan1CtaLabel?: string;
	plan1CtaHref?: string;
	plan2Name?: string;
	plan2Price?: string;
	plan2Feature?: string;
	plan2CtaLabel?: string;
	plan2CtaHref?: string;
	plan3Name?: string;
	plan3Price?: string;
	plan3Feature?: string;
	plan3CtaLabel?: string;
	plan3CtaHref?: string;
	plan4Name?: string;
	plan4Price?: string;
	plan4Feature?: string;
	plan4CtaLabel?: string;
	plan4CtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageBrandStoryTimelineSection = {
	type: "brand-story-timeline";
	heading?: string;
	subtitle?: string;
	milestone1Date?: string;
	milestone1Title?: string;
	milestone1Body?: string;
	milestone1ImageUrl?: string;
	milestone2Date?: string;
	milestone2Title?: string;
	milestone2Body?: string;
	milestone2ImageUrl?: string;
	milestone3Date?: string;
	milestone3Title?: string;
	milestone3Body?: string;
	milestone3ImageUrl?: string;
	milestone4Date?: string;
	milestone4Title?: string;
	milestone4Body?: string;
	milestone4ImageUrl?: string;
	style?: HomepageStyleProps;
};

export type HomepageSocialLinksBarSection = {
	type: "social-links-bar";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	link1Label?: string;
	link1Href?: string;
	link1Icon?: string;
	link2Label?: string;
	link2Href?: string;
	link2Icon?: string;
	link3Label?: string;
	link3Href?: string;
	link3Icon?: string;
	link4Label?: string;
	link4Href?: string;
	link4Icon?: string;
	link5Label?: string;
	link5Href?: string;
	link5Icon?: string;
	link6Label?: string;
	link6Href?: string;
	link6Icon?: string;
	style?: HomepageStyleProps;
};

export type HomepageFeatureTableLiteSection = {
	type: "feature-table-lite";
	heading?: string;
	subtitle?: string;
	col1Name?: string;
	col2Name?: string;
	col3Name?: string;
	col4Name?: string;
	row1Label?: string;
	row1Col1?: string;
	row1Col2?: string;
	row1Col3?: string;
	row1Col4?: string;
	row2Label?: string;
	row2Col1?: string;
	row2Col2?: string;
	row2Col3?: string;
	row2Col4?: string;
	row3Label?: string;
	row3Col1?: string;
	row3Col2?: string;
	row3Col3?: string;
	row3Col4?: string;
	row4Label?: string;
	row4Col1?: string;
	row4Col2?: string;
	row4Col3?: string;
	row4Col4?: string;
	style?: HomepageStyleProps;
};

export type HomepageTeamIntroCardsSection = {
	type: "team-intro-cards";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	member1Name?: string;
	member1Role?: string;
	member1Bio?: string;
	member1ImageUrl?: string;
	member1ProfileHref?: string;
	member2Name?: string;
	member2Role?: string;
	member2Bio?: string;
	member2ImageUrl?: string;
	member2ProfileHref?: string;
	member3Name?: string;
	member3Role?: string;
	member3Bio?: string;
	member3ImageUrl?: string;
	member3ProfileHref?: string;
	member4Name?: string;
	member4Role?: string;
	member4Bio?: string;
	member4ImageUrl?: string;
	member4ProfileHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageLogoWithCtaStripSection = {
	type: "logo-with-cta-strip";
	heading?: string;
	subtitle?: string;
	logoText?: string;
	logoImageUrl?: string;
	ctaLabel?: string;
	ctaHref?: string;
	secondaryCtaLabel?: string;
	secondaryCtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageTestimonialMarqueeLiteSection = {
	type: "testimonial-marquee-lite";
	heading?: string;
	subtitle?: string;
	speed?: "slow" | "normal" | "fast";
	pauseOnHover?: "on" | "off";
	item1Quote?: string;
	item1Author?: string;
	item2Quote?: string;
	item2Author?: string;
	item3Quote?: string;
	item3Author?: string;
	item4Quote?: string;
	item4Author?: string;
	item5Quote?: string;
	item5Author?: string;
	item6Quote?: string;
	item6Author?: string;
	style?: HomepageStyleProps;
};

export type HomepageFeatureIconTableSection = {
	type: "feature-icon-table";
	heading?: string;
	subtitle?: string;
	col1Name?: string;
	col2Name?: string;
	col3Name?: string;
	col4Name?: string;
	row1Icon?: string;
	row1Label?: string;
	row1Col1?: string;
	row1Col2?: string;
	row1Col3?: string;
	row1Col4?: string;
	row2Icon?: string;
	row2Label?: string;
	row2Col1?: string;
	row2Col2?: string;
	row2Col3?: string;
	row2Col4?: string;
	row3Icon?: string;
	row3Label?: string;
	row3Col1?: string;
	row3Col2?: string;
	row3Col3?: string;
	row3Col4?: string;
	row4Icon?: string;
	row4Label?: string;
	row4Col1?: string;
	row4Col2?: string;
	row4Col3?: string;
	row4Col4?: string;
	style?: HomepageStyleProps;
};

export type HomepageFaqTwoColumnSection = {
	type: "faq-two-column";
	heading?: string;
	subtitle?: string;
	q1Question?: string;
	q1Answer?: string;
	q2Question?: string;
	q2Answer?: string;
	q3Question?: string;
	q3Answer?: string;
	q4Question?: string;
	q4Answer?: string;
	helpTitle?: string;
	helpBody?: string;
	helpCtaLabel?: string;
	helpCtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageProductBundleLiteSection = {
	type: "product-bundle-lite";
	heading?: string;
	subtitle?: string;
	bundleName?: string;
	bundleItems?: string;
	bundlePrice?: string;
	bundleCompareAt?: string;
	ctaLabel?: string;
	ctaHref?: string;
	note?: string;
	style?: HomepageStyleProps;
};

export type HomepageAnnouncementStackSection = {
	type: "announcement-stack";
	heading?: string;
	subtitle?: string;
	item1Level?: "info" | "success" | "warning" | "error";
	item1Title?: string;
	item1Body?: string;
	item2Level?: "info" | "success" | "warning" | "error";
	item2Title?: string;
	item2Body?: string;
	item3Level?: "info" | "success" | "warning" | "error";
	item3Title?: string;
	item3Body?: string;
	item4Level?: "info" | "success" | "warning" | "error";
	item4Title?: string;
	item4Body?: string;
	style?: HomepageStyleProps;
};

export type HomepageProductFeatureTabsSection = {
	type: "product-feature-tabs";
	heading?: string;
	subtitle?: string;
	tab1Title?: string;
	tab1Body?: string;
	tab2Title?: string;
	tab2Body?: string;
	tab3Title?: string;
	tab3Body?: string;
	tab4Title?: string;
	tab4Body?: string;
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageBenefitCardsGridSection = {
	type: "benefit-cards-grid";
	heading?: string;
	subtitle?: string;
	columns?: 2 | 3 | 4;
	card1Icon?: string;
	card1Title?: string;
	card1Body?: string;
	card1CtaLabel?: string;
	card1CtaHref?: string;
	card2Icon?: string;
	card2Title?: string;
	card2Body?: string;
	card2CtaLabel?: string;
	card2CtaHref?: string;
	card3Icon?: string;
	card3Title?: string;
	card3Body?: string;
	card3CtaLabel?: string;
	card3CtaHref?: string;
	card4Icon?: string;
	card4Title?: string;
	card4Body?: string;
	card4CtaLabel?: string;
	card4CtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageShippingReturnsPanelSection = {
	type: "shipping-returns-panel";
	heading?: string;
	subtitle?: string;
	shippingTitle?: string;
	shippingBody?: string;
	returnsTitle?: string;
	returnsBody?: string;
	paymentTitle?: string;
	paymentBody?: string;
	supportTitle?: string;
	supportBody?: string;
	primaryCtaLabel?: string;
	primaryCtaHref?: string;
	secondaryCtaLabel?: string;
	secondaryCtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageSupportContactSplitSection = {
	type: "support-contact-split";
	heading?: string;
	subtitle?: string;
	leftTitle?: string;
	leftBody?: string;
	channel1Label?: string;
	channel1Value?: string;
	channel1Href?: string;
	channel2Label?: string;
	channel2Value?: string;
	channel2Href?: string;
	channel3Label?: string;
	channel3Value?: string;
	channel3Href?: string;
	slaTitle?: string;
	slaBody?: string;
	slaBadge?: string;
	primaryCtaLabel?: string;
	primaryCtaHref?: string;
	secondaryCtaLabel?: string;
	secondaryCtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageFaqCategoryPillsSection = {
	type: "faq-category-pills";
	heading?: string;
	subtitle?: string;
	category1Name?: string;
	category1Q1?: string;
	category1A1?: string;
	category1Q2?: string;
	category1A2?: string;
	category2Name?: string;
	category2Q1?: string;
	category2A1?: string;
	category2Q2?: string;
	category2A2?: string;
	category3Name?: string;
	category3Q1?: string;
	category3A1?: string;
	category3Q2?: string;
	category3A2?: string;
	defaultCategory?: "category1" | "category2" | "category3";
	helpCtaLabel?: string;
	helpCtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepagePromoTileMosaicSection = {
	type: "promo-tile-mosaic";
	heading?: string;
	subtitle?: string;
	tile1Badge?: string;
	tile1Title?: string;
	tile1Body?: string;
	tile1CtaLabel?: string;
	tile1CtaHref?: string;
	tile2Badge?: string;
	tile2Title?: string;
	tile2Body?: string;
	tile2CtaLabel?: string;
	tile2CtaHref?: string;
	tile3Badge?: string;
	tile3Title?: string;
	tile3Body?: string;
	tile3CtaLabel?: string;
	tile3CtaHref?: string;
	tile4Badge?: string;
	tile4Title?: string;
	tile4Body?: string;
	tile4CtaLabel?: string;
	tile4CtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageBundlePriceBreakdownSection = {
	type: "bundle-price-breakdown";
	heading?: string;
	subtitle?: string;
	planName?: string;
	item1Label?: string;
	item1Price?: string;
	item2Label?: string;
	item2Price?: string;
	item3Label?: string;
	item3Price?: string;
	totalLabel?: string;
	totalPrice?: string;
	saveLabel?: string;
	saveValue?: string;
	ctaLabel?: string;
	ctaHref?: string;
	note?: string;
	style?: HomepageStyleProps;
};

export type HomepageStoreHoursStatusSection = {
	type: "store-hours-status";
	heading?: string;
	subtitle?: string;
	timezoneLabel?: string;
	statusMode?: "open" | "closed" | "notice";
	statusText?: string;
	weekdayHours?: string;
	weekendHours?: string;
	holidayHours?: string;
	noticeText?: string;
	primaryCtaLabel?: string;
	primaryCtaHref?: string;
	secondaryCtaLabel?: string;
	secondaryCtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageTrustFaqStripSection = {
	type: "trust-faq-strip";
	heading?: string;
	subtitle?: string;
	trust1Icon?: string;
	trust1Label?: string;
	trust2Icon?: string;
	trust2Label?: string;
	trust3Icon?: string;
	trust3Label?: string;
	faq1Q?: string;
	faq1A?: string;
	faq2Q?: string;
	faq2A?: string;
	faq3Q?: string;
	faq3A?: string;
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageUspMetricsSplitSection = {
	type: "usp-metrics-split";
	heading?: string;
	subtitle?: string;
	usp1Title?: string;
	usp1Body?: string;
	usp2Title?: string;
	usp2Body?: string;
	usp3Title?: string;
	usp3Body?: string;
	metric1Label?: string;
	metric1Value?: string;
	metric1Note?: string;
	metric2Label?: string;
	metric2Value?: string;
	metric2Note?: string;
	metric3Label?: string;
	metric3Value?: string;
	metric3Note?: string;
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageCategoryPromoRailSection = {
	type: "category-promo-rail";
	heading?: string;
	subtitle?: string;
	category1Name?: string;
	category1Href?: string;
	category2Name?: string;
	category2Href?: string;
	category3Name?: string;
	category3Href?: string;
	promo1Badge?: string;
	promo1Title?: string;
	promo1Body?: string;
	promo1CtaLabel?: string;
	promo1CtaHref?: string;
	promo2Badge?: string;
	promo2Title?: string;
	promo2Body?: string;
	promo2CtaLabel?: string;
	promo2CtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageHelpdeskQuickFaqSection = {
	type: "helpdesk-quick-faq";
	heading?: string;
	subtitle?: string;
	faq1Q?: string;
	faq1A?: string;
	faq2Q?: string;
	faq2A?: string;
	faq3Q?: string;
	faq3A?: string;
	channel1Label?: string;
	channel1Value?: string;
	channel1Href?: string;
	channel2Label?: string;
	channel2Value?: string;
	channel2Href?: string;
	primaryCtaLabel?: string;
	primaryCtaHref?: string;
	secondaryCtaLabel?: string;
	secondaryCtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageStickyAnnouncementQueueSection = {
	type: "sticky-announcement-queue";
	heading?: string;
	announce1Text?: string;
	announce1Level?: "info" | "success" | "warning";
	announce1Href?: string;
	announce2Text?: string;
	announce2Level?: "info" | "success" | "warning";
	announce2Href?: string;
	announce3Text?: string;
	announce3Level?: "info" | "success" | "warning";
	announce3Href?: string;
	autoRotateSeconds?: number;
	style?: HomepageStyleProps;
};

export type HomepageTieredPricingTableSection = {
	type: "tiered-pricing-table";
	heading?: string;
	subtitle?: string;
	tier1Name?: string;
	tier1Price?: string;
	tier1Features?: string;
	tier1CtaLabel?: string;
	tier1CtaHref?: string;
	tier2Name?: string;
	tier2Price?: string;
	tier2Features?: string;
	tier2CtaLabel?: string;
	tier2CtaHref?: string;
	tier3Name?: string;
	tier3Price?: string;
	tier3Features?: string;
	tier3CtaLabel?: string;
	tier3CtaHref?: string;
	highlightTier?: "tier1" | "tier2" | "tier3";
	style?: HomepageStyleProps;
};

export type HomepageServiceProcessStepsSection = {
	type: "service-process-steps";
	heading?: string;
	subtitle?: string;
	step1Title?: string;
	step1Body?: string;
	step2Title?: string;
	step2Body?: string;
	step3Title?: string;
	step3Body?: string;
	step4Title?: string;
	step4Body?: string;
	note?: string;
	primaryCtaLabel?: string;
	primaryCtaHref?: string;
	secondaryCtaLabel?: string;
	secondaryCtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageInventoryAvailabilityMatrixSection = {
	type: "inventory-availability-matrix";
	heading?: string;
	subtitle?: string;
	item1Name?: string;
	item1Stock?: string;
	item1Eta?: string;
	item2Name?: string;
	item2Stock?: string;
	item2Eta?: string;
	item3Name?: string;
	item3Stock?: string;
	item3Eta?: string;
	warehouseNote?: string;
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageCrossBorderShippingNoticeSection = {
	type: "cross-border-shipping-notice";
	heading?: string;
	subtitle?: string;
	region1Name?: string;
	region1Eta?: string;
	region1Duty?: string;
	region2Name?: string;
	region2Eta?: string;
	region2Duty?: string;
	region3Name?: string;
	region3Eta?: string;
	region3Duty?: string;
	policyNote?: string;
	primaryCtaLabel?: string;
	primaryCtaHref?: string;
	secondaryCtaLabel?: string;
	secondaryCtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageReturnsPolicyQuickCardsSection = {
	type: "returns-policy-quick-cards";
	heading?: string;
	subtitle?: string;
	card1Title?: string;
	card1Body?: string;
	card1Limit?: string;
	card2Title?: string;
	card2Body?: string;
	card2Limit?: string;
	card3Title?: string;
	card3Body?: string;
	card3Limit?: string;
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageComplianceCertificatesGridSection = {
	type: "compliance-certificates-grid";
	heading?: string;
	subtitle?: string;
	cert1Title?: string;
	cert1Code?: string;
	cert1Issuer?: string;
	cert2Title?: string;
	cert2Code?: string;
	cert2Issuer?: string;
	cert3Title?: string;
	cert3Code?: string;
	cert3Issuer?: string;
	cert4Title?: string;
	cert4Code?: string;
	cert4Issuer?: string;
	note?: string;
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageBulkOrderInquiryStripSection = {
	type: "bulk-order-inquiry-strip";
	heading?: string;
	subtitle?: string;
	minOrderLabel?: string;
	minOrderValue?: string;
	leadTimeLabel?: string;
	leadTimeValue?: string;
	customizationLabel?: string;
	customizationValue?: string;
	contactLabel?: string;
	contactValue?: string;
	primaryCtaLabel?: string;
	primaryCtaHref?: string;
	secondaryCtaLabel?: string;
	secondaryCtaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageRegionalServiceMapLiteSection = {
	type: "regional-service-map-lite";
	heading?: string;
	subtitle?: string;
	region1Name?: string;
	region1Coverage?: string;
	region1Sla?: string;
	region2Name?: string;
	region2Coverage?: string;
	region2Sla?: string;
	region3Name?: string;
	region3Coverage?: string;
	region3Sla?: string;
	region4Name?: string;
	region4Coverage?: string;
	region4Sla?: string;
	note?: string;
	ctaLabel?: string;
	ctaHref?: string;
	style?: HomepageStyleProps;
};

export type HomepageContainerSection = {
	type: "container";
	eyebrow?: string;
	heading?: string;
	body?: string;
	backgroundColor?: string;
	backgroundImageUrl?: string;
	textColor?: string;
	contentAlign?: "left" | "center";
	widthMode?: "narrow" | "normal" | "wide" | "full";
	minHeight?: number;
	paddingX?: number;
	paddingY?: number;
	titleSize?: "md" | "lg" | "xl";
	bodySize?: "sm" | "md" | "lg";
	buttonLabel?: string;
	buttonHref?: string;
	buttonVariant?: "solid" | "outline";
	buttonSize?: "sm" | "md" | "lg";
	style?: HomepageStyleProps;
};

export type HomepageButtonRowSection = {
	type: "button-row";
	heading?: string;
	subtitle?: string;
	primaryLabel?: string;
	primaryHref?: string;
	secondaryLabel?: string;
	secondaryHref?: string;
	buttonSize?: "sm" | "md" | "lg";
	align?: "left" | "center";
	style?: HomepageStyleProps;
};

export type HomepageSpacerSection = {
	type: "spacer";
	height?: number;
};

export type HomepageSection =
	| HomepageFeaturedProductsSection
	| HomepageHeroSection
	| HomepageRichTextSection
	| HomepageHeadingSection
	| HomepageImageBannerSection
	| HomepageIconListSection
	| HomepageFaqAccordionSection
	| HomepageFeaturedCollectionsSection
	| HomepagePromoBannerSection
	| HomepageTestimonialsSection
	| HomepageStorePoliciesSection
	| HomepageCategoryGridSection
	| HomepageProductSpotlightSection
	| HomepageCountdownSection
	| HomepageFeaturedCategoriesAutoSection
	| HomepageLogoCloudSection
	| HomepageTimelineStepsSection
	| HomepageCollectionHeroSection
	| HomepageContactQuickActionsSection
	| HomepageStatsCounterSection
	| HomepageCardGridSection
	| HomepageNewsletterSignupSection
	| HomepageVideoEmbedSection
	| HomepageAnnouncementBarSection
	| HomepageTrustBadgesSection
	| HomepageContactFormLiteSection
	| HomepageTabsContentSection
	| HomepageBeforeAfterSection
	| HomepageSocialProofFeedSection
	| HomepageFaqCompactSection
	| HomepageMetricCardsSection
	| HomepageMediaTextSplitSection
	| HomepageQuoteHighlightSection
	| HomepageFeatureComparisonSection
	| HomepageInlineCtaBannerSection
	| HomepageLogoStripCompactSection
	| HomepageEventHighlightsSection
	| HomepageCtaCardPairSection
	| HomepageFaqWithCtaSection
	| HomepagePartnerMetricsSection
	| HomepageStoryStepsSection
	| HomepageMediaCarouselSection
	| HomepageFeatureChecklistSection
	| HomepageMiniBlogCardsSection
	| HomepageTrustLogoWallSection
	| HomepageDualHeroSplitSection
	| HomepageQuickLinksGridSection
	| HomepageStoreLocatorLiteSection
	| HomepageTimelineCompactSection
	| HomepageFaqCardsSection
	| HomepageProductComparisonLiteSection
	| HomepageCtaMarqueeSection
	| HomepageFaqAccordionPlusSection
	| HomepageUspPillRowSection
	| HomepagePricingCardLiteSection
	| HomepageBrandStoryTimelineSection
	| HomepageSocialLinksBarSection
	| HomepageFeatureTableLiteSection
	| HomepageTeamIntroCardsSection
	| HomepageLogoWithCtaStripSection
	| HomepageTestimonialMarqueeLiteSection
	| HomepageFeatureIconTableSection
	| HomepageFaqTwoColumnSection
	| HomepageProductBundleLiteSection
	| HomepageAnnouncementStackSection
	| HomepageProductFeatureTabsSection
	| HomepageBenefitCardsGridSection
	| HomepageShippingReturnsPanelSection
	| HomepageSupportContactSplitSection
	| HomepageFaqCategoryPillsSection
	| HomepagePromoTileMosaicSection
	| HomepageBundlePriceBreakdownSection
	| HomepageStoreHoursStatusSection
	| HomepageTrustFaqStripSection
	| HomepageUspMetricsSplitSection
	| HomepageCategoryPromoRailSection
	| HomepageHelpdeskQuickFaqSection
	| HomepageStickyAnnouncementQueueSection
	| HomepageTieredPricingTableSection
	| HomepageServiceProcessStepsSection
	| HomepageInventoryAvailabilityMatrixSection
	| HomepageCrossBorderShippingNoticeSection
	| HomepageReturnsPolicyQuickCardsSection
	| HomepageComplianceCertificatesGridSection
	| HomepageBulkOrderInquiryStripSection
	| HomepageRegionalServiceMapLiteSection
	| HomepageContainerSection
	| HomepageButtonRowSection
	| HomepageSpacerSection;
export type HomepageSectionType = HomepageSection["type"];

export type HomepageBuilderFieldType =
	| "text"
	| "textarea"
	| "url"
	| "number"
	| "collectionSlug"
	| "select"
	| "color"
	| "imageUpload";

export type HomepageBuilderField = {
	key: string;
	label: string;
	type: HomepageBuilderFieldType;
	tier?: "must-have" | "secondary" | "advanced";
	required?: boolean;
	placeholder?: string;
	helpText?: string;
	min?: number;
	max?: number;
	options?: Array<{ label: string; value: string }>;
};

export type HomepageSectionGroup = "layout" | "content" | "commerce" | "utility";
export type HomepageSectionTier = "must-have" | "secondary" | "advanced";

export type HomepageSectionRegistryItem = {
	type: HomepageSectionType;
	title: string;
	description: string;
	group: HomepageSectionGroup;
	tier: HomepageSectionTier;
	rolloutOrder: number;
	/**
	 * Stable component identifier for Puck registration.
	 */
	puckComponent: string;
	defaults: HomepageSection;
	fields: HomepageBuilderField[];
};

export type HomepageLayout = {
	schemaVersion: number;
	sections: HomepageSection[];
	updatedAt?: string;
	version?: number;
	note?: string;
};

export const HOMEPAGE_LAYOUT_SCHEMA_VERSION = 1;

const MAX_SECTIONS = 48;
const MIN_PRODUCT_LIMIT = 1;
const MAX_PRODUCT_LIMIT = 48;
const DEFAULT_PRODUCT_LIMIT = 12;
const MIN_CATEGORY_LIMIT = 2;
const MAX_CATEGORY_LIMIT = 12;
const DEFAULT_CATEGORY_LIMIT = 6;
const MIN_SPACER_HEIGHT = 8;
const MAX_SPACER_HEIGHT = 240;
const MIN_SECTION_MIN_HEIGHT = 120;
const MAX_SECTION_MIN_HEIGHT = 1200;
const MIN_SECTION_PADDING = 0;
const MAX_SECTION_PADDING = 160;
const STYLE_SPACING_OPTIONS = [
	{ label: "无", value: "none" },
	{ label: "小", value: "sm" },
	{ label: "中", value: "md" },
	{ label: "大", value: "lg" },
] as const;
const STYLE_RADIUS_OPTIONS = [
	{ label: "无", value: "none" },
	{ label: "小", value: "sm" },
	{ label: "中", value: "md" },
	{ label: "大", value: "lg" },
] as const;
const STYLE_SHADOW_OPTIONS = [
	{ label: "无", value: "none" },
	{ label: "小", value: "sm" },
	{ label: "中", value: "md" },
	{ label: "大", value: "lg" },
] as const;

type SharedStyleFieldOptions = {
	includeBackground?: boolean;
	includeContainer?: boolean;
	includeSpacing?: boolean;
	includeShape?: boolean;
	includeTextColor?: boolean;
	includeSizing?: boolean;
};

function createSharedStyleFields(options: SharedStyleFieldOptions): HomepageBuilderField[] {
	const fields: HomepageBuilderField[] = [];
	if (options.includeBackground) {
		fields.push(
			{
				key: "backgroundMode",
				label: "背景模式",
				type: "select",
				tier: "must-have",
				options: [
					{ label: "无背景", value: "none" },
					{ label: "主题色", value: "token" },
					{ label: "图片", value: "image" },
					{ label: "自定义颜色", value: "custom" },
				],
			},
			{
				key: "backgroundToken",
				label: "背景主题色",
				type: "select",
				tier: "must-have",
				options: [
					{ label: "页面背景", value: "background" },
					{ label: "卡片背景", value: "card" },
					{ label: "弱化背景", value: "muted" },
					{ label: "次级背景", value: "secondary" },
					{ label: "强调背景", value: "accent" },
				],
			},
			{ key: "backgroundColor", label: "背景颜色", type: "color", tier: "must-have", placeholder: "#ffffff" },
			{
				key: "backgroundImageUrl",
				label: "背景图片",
				type: "imageUpload",
				tier: "must-have",
				placeholder: "点击上传，或粘贴图片 URL",
				helpText: "支持上传（走 Saleor 存储）或手动输入 URL。",
			},
		);
	}
	if (options.includeContainer) {
		fields.push({
			key: "widthMode",
			label: "区块宽度",
			type: "select",
			tier: "secondary",
			options: [
				{ label: "窄", value: "narrow" },
				{ label: "标准", value: "normal" },
				{ label: "宽", value: "wide" },
				{ label: "全宽", value: "full" },
			],
		});
	}
	if (options.includeSpacing) {
		fields.push(
			{
				key: "spacingTop",
				label: "上间距",
				type: "select",
				tier: "must-have",
				options: STYLE_SPACING_OPTIONS.map((option) => ({ label: option.label, value: option.value })),
			},
			{
				key: "spacingBottom",
				label: "下间距",
				type: "select",
				tier: "must-have",
				options: STYLE_SPACING_OPTIONS.map((option) => ({ label: option.label, value: option.value })),
			},
		);
	}
	if (options.includeShape) {
		fields.push(
			{
				key: "cornerRadius",
				label: "圆角",
				type: "select",
				tier: "must-have",
				options: STYLE_RADIUS_OPTIONS.map((option) => ({ label: option.label, value: option.value })),
			},
			{
				key: "shadowPreset",
				label: "阴影",
				type: "select",
				tier: "must-have",
				options: STYLE_SHADOW_OPTIONS.map((option) => ({ label: option.label, value: option.value })),
			},
		);
	}
	if (options.includeTextColor) {
		fields.push({
			key: "textColor",
			label: "文字颜色",
			type: "color",
			tier: "must-have",
			placeholder: "#111827",
		});
		fields.push({
			key: "contentAlign",
			label: "内容对齐",
			type: "select",
			tier: "must-have",
			options: [
				{ label: "左对齐", value: "left" },
				{ label: "居中", value: "center" },
			],
		});
	}
	if (options.includeSizing) {
		fields.push(
			{
				key: "minHeight",
				label: "最小高度（px）",
				type: "number",
				tier: "advanced",
				min: MIN_SECTION_MIN_HEIGHT,
				max: MAX_SECTION_MIN_HEIGHT,
			},
			{
				key: "paddingX",
				label: "左右内边距（px）",
				type: "number",
				tier: "advanced",
				min: MIN_SECTION_PADDING,
				max: MAX_SECTION_PADDING,
			},
			{
				key: "paddingY",
				label: "上下内边距（px）",
				type: "number",
				tier: "advanced",
				min: MIN_SECTION_PADDING,
				max: MAX_SECTION_PADDING,
			},
		);
	}
	return fields;
}

function createStyleModeFields(): HomepageBuilderField[] {
	return [
		{
			key: "backgroundMode",
			label: "背景模式",
			type: "select",
			tier: "must-have",
			options: [
				{ label: "自动", value: "none" },
				{ label: "主题色", value: "token" },
				{ label: "图片", value: "image" },
				{ label: "自定义颜色", value: "custom" },
			],
		},
		{
			key: "backgroundToken",
			label: "背景主题色",
			type: "select",
			tier: "must-have",
			options: [
				{ label: "页面背景", value: "background" },
				{ label: "卡片背景", value: "card" },
				{ label: "弱化背景", value: "muted" },
				{ label: "次级背景", value: "secondary" },
				{ label: "强调背景", value: "accent" },
			],
		},
	];
}

const HOMEPAGE_SECTION_REGISTRY: HomepageSectionRegistryItem[] = [
	{
		type: "hero",
		title: "主视觉",
		description: "用于首页主横幅，可配置标题、副标题和按钮。",
		group: "content",
		tier: "must-have",
		rolloutOrder: 1,
		puckComponent: "HeroSection",
		defaults: {
			type: "hero",
			eyebrow: "New arrivals",
			title: "Build your storefront",
			subtitle: "Configure this section in Storefront Builder and publish when ready.",
			ctaLabel: "Shop now",
			ctaHref: "/products",
			backgroundColor: "",
			backgroundImageUrl: "",
			textColor: "",
			contentAlign: "left",
			widthMode: "normal",
			minHeight: 280,
			paddingX: 48,
			paddingY: 48,
			titleSize: "xl",
			buttonVariant: "solid",
			buttonSize: "md",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
				minHeight: 280,
				paddingX: 48,
				paddingY: 48,
			},
		},
		fields: [
			{ key: "eyebrow", label: "上方短标题", type: "text", placeholder: "例如：新品上架" },
			{
				key: "title",
				label: "主标题",
				type: "text",
				required: true,
				placeholder: "例如：Build your storefront",
			},
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "用于补充说明的短文案" },
			{ key: "ctaLabel", label: "按钮文字", type: "text", placeholder: "例如：立即购买" },
			{
				key: "ctaHref",
				label: "按钮链接",
				type: "url",
				placeholder: "/products",
				helpText: "可填站内相对路径或完整 URL",
			},
			{ key: "backgroundColor", label: "背景色", type: "color", placeholder: "#0f172a" },
			{
				key: "backgroundImageUrl",
				label: "背景图片",
				type: "imageUpload",
				placeholder: "点击上传，或粘贴图片 URL",
				helpText: "支持上传（走 Saleor 存储）或手动输入 URL。",
			},
			{ key: "textColor", label: "文字颜色", type: "color", placeholder: "#ffffff" },
			{
				key: "contentAlign",
				label: "内容对齐",
				type: "select",
				options: [
					{ label: "左对齐", value: "left" },
					{ label: "居中", value: "center" },
				],
			},
			{
				key: "widthMode",
				label: "区块宽度",
				type: "select",
				options: [
					{ label: "窄", value: "narrow" },
					{ label: "标准", value: "normal" },
					{ label: "宽", value: "wide" },
					{ label: "全宽", value: "full" },
				],
			},
			{
				key: "minHeight",
				label: "最小高度（px）",
				type: "number",
				min: MIN_SECTION_MIN_HEIGHT,
				max: MAX_SECTION_MIN_HEIGHT,
			},
			{
				key: "paddingX",
				label: "左右内边距（px）",
				type: "number",
				min: MIN_SECTION_PADDING,
				max: MAX_SECTION_PADDING,
			},
			{
				key: "paddingY",
				label: "上下内边距（px）",
				type: "number",
				min: MIN_SECTION_PADDING,
				max: MAX_SECTION_PADDING,
			},
			{
				key: "titleSize",
				label: "主标题大小",
				type: "select",
				options: [
					{ label: "大", value: "lg" },
					{ label: "很大", value: "xl" },
					{ label: "超大", value: "2xl" },
				],
			},
			{
				key: "buttonVariant",
				label: "按钮样式",
				type: "select",
				options: [
					{ label: "实心", value: "solid" },
					{ label: "描边", value: "outline" },
				],
			},
			{
				key: "buttonSize",
				label: "按钮大小",
				type: "select",
				options: [
					{ label: "小", value: "sm" },
					{ label: "中", value: "md" },
					{ label: "大", value: "lg" },
				],
			},
			...createStyleModeFields(),
			...createSharedStyleFields({
				includeSpacing: true,
				includeShape: true,
			}),
		],
	},
	{
		type: "featured-products",
		title: "精选商品",
		description: "按集合（collection）展示商品网格。",
		group: "commerce",
		tier: "must-have",
		rolloutOrder: 2,
		puckComponent: "FeaturedProductsSection",
		defaults: {
			type: "featured-products",
			heading: "Featured products",
			collectionSlug: "featured-products",
			limit: DEFAULT_PRODUCT_LIMIT,
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：精选商品" },
			{
				key: "collectionSlug",
				label: "集合 Slug",
				type: "collectionSlug",
				required: true,
				placeholder: "featured-products",
			},
			{
				key: "limit",
				label: "商品数量上限",
				type: "number",
				min: MIN_PRODUCT_LIMIT,
				max: MAX_PRODUCT_LIMIT,
				helpText: "允许范围：1-48",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "rich-text",
		title: "富文本",
		description: "用于公告、介绍、政策等文本内容。",
		group: "content",
		tier: "must-have",
		rolloutOrder: 3,
		puckComponent: "RichTextSection",
		defaults: {
			type: "rich-text",
			heading: "About this store",
			body: "Add your short tenant-specific content here.",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：关于本店" },
			{ key: "body", label: "正文", type: "textarea", placeholder: "在这里输入内容..." },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "heading",
		title: "标题区块",
		description: "用于插入标题、副标题与单个按钮 CTA。",
		group: "content",
		tier: "must-have",
		rolloutOrder: 4,
		puckComponent: "HeadingSection",
		defaults: {
			type: "heading",
			eyebrow: "店铺信息",
			title: "打造你的品牌主页",
			subtitle: "可用于介绍品牌定位、活动主题或类目入口。",
			ctaLabel: "立即查看",
			ctaHref: "/products",
			titleSize: "lg",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "eyebrow", label: "上方短标题", type: "text", placeholder: "例如：店铺信息" },
			{ key: "title", label: "标题", type: "text", required: true, placeholder: "例如：打造你的品牌主页" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "用于补充说明的文案" },
			{
				key: "titleSize",
				label: "标题大小",
				type: "select",
				options: [
					{ label: "中", value: "md" },
					{ label: "大", value: "lg" },
					{ label: "超大", value: "xl" },
				],
			},
			{ key: "ctaLabel", label: "按钮文字", type: "text", placeholder: "例如：立即查看" },
			{ key: "ctaHref", label: "按钮链接", type: "url", placeholder: "/products" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
				includeSizing: true,
			}),
		],
	},
	{
		type: "image-banner",
		title: "图片横幅",
		description: "图文横幅，可设置图片位置、样式和 CTA。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 5,
		puckComponent: "ImageBannerSection",
		defaults: {
			type: "image-banner",
			eyebrow: "新品专题",
			heading: "用图片展示核心卖点",
			body: "适合品牌活动、主推商品或出口市场专题页。",
			imageUrl: "",
			imageAlt: "横幅图片",
			imageFit: "cover",
			imagePosition: "right",
			ctaLabel: "查看商品",
			ctaHref: "/products",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "eyebrow", label: "上方短标题", type: "text", placeholder: "例如：新品专题" },
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：用图片展示核心卖点" },
			{ key: "body", label: "正文", type: "textarea", placeholder: "在这里输入横幅说明..." },
			{
				key: "imageUrl",
				label: "图片",
				type: "imageUpload",
				placeholder: "点击上传，或粘贴图片 URL",
				helpText: "建议上传 1200x800 以上图片，以获得更清晰展示。",
			},
			{ key: "imageAlt", label: "图片描述（ALT）", type: "text", placeholder: "例如：品牌横幅图" },
			{
				key: "imageFit",
				label: "图片裁切",
				type: "select",
				options: [
					{ label: "铺满（cover）", value: "cover" },
					{ label: "完整显示（contain）", value: "contain" },
				],
			},
			{
				key: "imagePosition",
				label: "图片位置",
				type: "select",
				options: [
					{ label: "左侧", value: "left" },
					{ label: "右侧", value: "right" },
					{ label: "顶部", value: "top" },
				],
			},
			{ key: "ctaLabel", label: "按钮文字", type: "text", placeholder: "例如：查看商品" },
			{ key: "ctaHref", label: "按钮链接", type: "url", placeholder: "/products" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
				includeSizing: true,
			}),
		],
	},
	{
		type: "icon-list",
		title: "图标卖点",
		description: "展示 2-4 个卖点，含图标、标题和说明。",
		group: "content",
		tier: "must-have",
		rolloutOrder: 6,
		puckComponent: "IconListSection",
		defaults: {
			type: "icon-list",
			heading: "为什么选择我们",
			subtitle: "给访客快速说明核心优势",
			columns: 3,
			item1Icon: "🚚",
			item1Title: "快速交付",
			item1Description: "主流线路可追踪，支持国际物流。",
			item2Icon: "🛡️",
			item2Title: "品质保障",
			item2Description: "严格质检流程，支持售后保障。",
			item3Icon: "🌍",
			item3Title: "全球市场",
			item3Description: "支持多渠道出海，覆盖更多客户。",
			item4Icon: "",
			item4Title: "",
			item4Description: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：为什么选择我们" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：给访客快速说明核心优势" },
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "item1Icon", label: "卖点1图标", type: "text", placeholder: "例如：🚚" },
			{ key: "item1Title", label: "卖点1标题", type: "text", placeholder: "例如：快速交付" },
			{ key: "item1Description", label: "卖点1说明", type: "textarea", placeholder: "简短说明..." },
			{ key: "item2Icon", label: "卖点2图标", type: "text", placeholder: "例如：🛡️" },
			{ key: "item2Title", label: "卖点2标题", type: "text", placeholder: "例如：品质保障" },
			{ key: "item2Description", label: "卖点2说明", type: "textarea", placeholder: "简短说明..." },
			{ key: "item3Icon", label: "卖点3图标", type: "text", placeholder: "例如：🌍" },
			{ key: "item3Title", label: "卖点3标题", type: "text", placeholder: "例如：全球市场" },
			{ key: "item3Description", label: "卖点3说明", type: "textarea", placeholder: "简短说明..." },
			{ key: "item4Icon", label: "卖点4图标", type: "text", placeholder: "可选" },
			{ key: "item4Title", label: "卖点4标题", type: "text", placeholder: "可选" },
			{ key: "item4Description", label: "卖点4说明", type: "textarea", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "faq-accordion",
		title: "常见问题",
		description: "展示 FAQ 问答列表，建议 3-5 条。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 7,
		puckComponent: "FaqAccordionSection",
		defaults: {
			type: "faq-accordion",
			heading: "常见问题",
			subtitle: "下单前客户常问的问题可集中展示在这里。",
			q1Question: "是否支持海外发货？",
			q1Answer: "支持，多数国家可通过标准物流发货，具体时效按目的地计算。",
			q2Question: "可以开具发票吗？",
			q2Answer: "可以，请在下单后联系在线客服补充开票信息。",
			q3Question: "售后如何处理？",
			q3Answer: "请在订单页提交售后申请，我们会在 1-2 个工作日内处理。",
			q4Question: "",
			q4Answer: "",
			q5Question: "",
			q5Answer: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：常见问题" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：下单前客户常问的问题..." },
			{ key: "q1Question", label: "问题1", type: "text", placeholder: "请输入问题" },
			{ key: "q1Answer", label: "回答1", type: "textarea", placeholder: "请输入回答" },
			{ key: "q2Question", label: "问题2", type: "text", placeholder: "请输入问题" },
			{ key: "q2Answer", label: "回答2", type: "textarea", placeholder: "请输入回答" },
			{ key: "q3Question", label: "问题3", type: "text", placeholder: "请输入问题" },
			{ key: "q3Answer", label: "回答3", type: "textarea", placeholder: "请输入回答" },
			{ key: "q4Question", label: "问题4（可选）", type: "text", placeholder: "可选" },
			{ key: "q4Answer", label: "回答4（可选）", type: "textarea", placeholder: "可选" },
			{ key: "q5Question", label: "问题5（可选）", type: "text", placeholder: "可选" },
			{ key: "q5Answer", label: "回答5（可选）", type: "textarea", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "featured-collections",
		title: "精选分类/合集",
		description: "展示最多 4 个集合入口，适合首页导航分流。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 8,
		puckComponent: "FeaturedCollectionsSection",
		defaults: {
			type: "featured-collections",
			heading: "精选合集",
			subtitle: "按业务主题引导访客浏览商品。",
			columns: 3,
			collectionSlug1: "featured-products",
			collectionSlug2: "",
			collectionSlug3: "",
			collectionSlug4: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：精选合集" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：按业务主题引导访客浏览商品。",
			},
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "collectionSlug1", label: "集合1", type: "collectionSlug", placeholder: "featured-products" },
			{ key: "collectionSlug2", label: "集合2", type: "collectionSlug", placeholder: "可选" },
			{ key: "collectionSlug3", label: "集合3", type: "collectionSlug", placeholder: "可选" },
			{ key: "collectionSlug4", label: "集合4", type: "collectionSlug", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "promo-banner",
		title: "促销横幅",
		description: "用于活动入口，支持时间窗口与双按钮 CTA。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 9,
		puckComponent: "PromoBannerSection",
		defaults: {
			type: "promo-banner",
			eyebrow: "限时活动",
			title: "春季促销进行中",
			subtitle: "下单立减，活动期间享受额外优惠。",
			badgeText: "限时",
			ctaLabel: "立即抢购",
			ctaHref: "/products",
			secondaryCtaLabel: "查看活动规则",
			secondaryCtaHref: "/default-channel/pages/shipping",
			scheduleMode: "always",
			scheduleStartIso: "",
			scheduleEndIso: "",
			style: {
				background: { mode: "token", token: "accent" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "eyebrow", label: "上方短标题", type: "text", placeholder: "例如：限时活动" },
			{ key: "title", label: "主标题", type: "text", placeholder: "例如：春季促销进行中" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "活动说明文案" },
			{ key: "badgeText", label: "角标文字", type: "text", placeholder: "例如：限时" },
			{ key: "ctaLabel", label: "主按钮文字", type: "text", placeholder: "例如：立即抢购" },
			{ key: "ctaHref", label: "主按钮链接", type: "url", placeholder: "/products" },
			{ key: "secondaryCtaLabel", label: "次按钮文字", type: "text", placeholder: "例如：查看活动规则" },
			{
				key: "secondaryCtaHref",
				label: "次按钮链接",
				type: "url",
				placeholder: "/default-channel/pages/shipping",
			},
			{
				key: "scheduleMode",
				label: "展示时段",
				type: "select",
				options: [
					{ label: "总是显示", value: "always" },
					{ label: "按时间窗口显示", value: "window" },
				],
			},
			{
				key: "scheduleStartIso",
				label: "开始时间（ISO）",
				type: "text",
				placeholder: "例如：2026-03-01T00:00:00+08:00",
			},
			{
				key: "scheduleEndIso",
				label: "结束时间（ISO）",
				type: "text",
				placeholder: "例如：2026-03-15T23:59:59+08:00",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
				includeSizing: true,
			}),
		],
	},
	{
		type: "testimonials",
		title: "客户评价",
		description: "展示客户反馈卡片，增强信任感。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 10,
		puckComponent: "TestimonialsSection",
		defaults: {
			type: "testimonials",
			heading: "客户怎么说",
			subtitle: "真实评价有助于提升转化。",
			columns: 3,
			item1Quote: "产品质量稳定，复购率很高。",
			item1Author: "Ethan",
			item1Role: "采购经理",
			item1AvatarUrl: "",
			item2Quote: "售后响应很快，沟通效率高。",
			item2Author: "Lily",
			item2Role: "跨境运营",
			item2AvatarUrl: "",
			item3Quote: "页面体验简洁，客户下单更顺畅。",
			item3Author: "Kevin",
			item3Role: "品牌负责人",
			item3AvatarUrl: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：客户怎么说" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：真实评价有助于提升转化。" },
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "item1Quote", label: "评价1", type: "textarea", placeholder: "请输入评价内容" },
			{ key: "item1Author", label: "评价1姓名", type: "text", placeholder: "例如：Ethan" },
			{ key: "item1Role", label: "评价1角色", type: "text", placeholder: "例如：采购经理" },
			{ key: "item1AvatarUrl", label: "评价1头像", type: "imageUpload", placeholder: "上传或粘贴头像 URL" },
			{ key: "item2Quote", label: "评价2", type: "textarea", placeholder: "请输入评价内容" },
			{ key: "item2Author", label: "评价2姓名", type: "text", placeholder: "例如：Lily" },
			{ key: "item2Role", label: "评价2角色", type: "text", placeholder: "例如：跨境运营" },
			{ key: "item2AvatarUrl", label: "评价2头像", type: "imageUpload", placeholder: "上传或粘贴头像 URL" },
			{ key: "item3Quote", label: "评价3", type: "textarea", placeholder: "请输入评价内容" },
			{ key: "item3Author", label: "评价3姓名", type: "text", placeholder: "例如：Kevin" },
			{ key: "item3Role", label: "评价3角色", type: "text", placeholder: "例如：品牌负责人" },
			{ key: "item3AvatarUrl", label: "评价3头像", type: "imageUpload", placeholder: "上传或粘贴头像 URL" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "store-policies",
		title: "店铺政策入口",
		description: "快速链接到配送、退货、支付、客服页面。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 11,
		puckComponent: "StorePoliciesSection",
		defaults: {
			type: "store-policies",
			heading: "购物保障",
			subtitle: "提前说明关键政策，减少咨询和流失。",
			columns: 2,
			policy1Label: "配送说明",
			policy1Href: "/default-channel/pages/shipping",
			policy1Description: "查看运费与时效政策",
			policy2Label: "退换政策",
			policy2Href: "/default-channel/pages/returns",
			policy2Description: "查看退换流程与条件",
			policy3Label: "支付方式",
			policy3Href: "/default-channel/pages/payment",
			policy3Description: "支持的支付渠道说明",
			policy4Label: "联系客服",
			policy4Href: "/default-channel/pages/support",
			policy4Description: "售前售后服务入口",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：购物保障" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：提前说明关键政策，减少咨询和流失。",
			},
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "policy1Label", label: "入口1名称", type: "text", placeholder: "例如：配送说明" },
			{ key: "policy1Href", label: "入口1链接", type: "url", placeholder: "/default-channel/pages/shipping" },
			{ key: "policy1Description", label: "入口1说明", type: "textarea", placeholder: "简短说明..." },
			{ key: "policy2Label", label: "入口2名称", type: "text", placeholder: "例如：退换政策" },
			{ key: "policy2Href", label: "入口2链接", type: "url", placeholder: "/default-channel/pages/returns" },
			{ key: "policy2Description", label: "入口2说明", type: "textarea", placeholder: "简短说明..." },
			{ key: "policy3Label", label: "入口3名称", type: "text", placeholder: "例如：支付方式" },
			{ key: "policy3Href", label: "入口3链接", type: "url", placeholder: "/default-channel/pages/payment" },
			{ key: "policy3Description", label: "入口3说明", type: "textarea", placeholder: "简短说明..." },
			{ key: "policy4Label", label: "入口4名称", type: "text", placeholder: "例如：联系客服" },
			{ key: "policy4Href", label: "入口4链接", type: "url", placeholder: "/default-channel/pages/support" },
			{ key: "policy4Description", label: "入口4说明", type: "textarea", placeholder: "简短说明..." },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "category-grid",
		title: "分类网格",
		description: "展示分类入口，支持 2-4 列与最多 6 个分类卡片。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 12,
		puckComponent: "CategoryGridSection",
		defaults: {
			type: "category-grid",
			heading: "热门分类",
			subtitle: "按分类快速进入目标商品列表。",
			columns: 3,
			categorySlug1: "clothing",
			categoryLabel1: "服饰",
			categorySlug2: "accessories",
			categoryLabel2: "配件",
			categorySlug3: "home-accessories",
			categoryLabel3: "家居",
			categorySlug4: "",
			categoryLabel4: "",
			categorySlug5: "",
			categoryLabel5: "",
			categorySlug6: "",
			categoryLabel6: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：热门分类" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：按分类快速进入目标商品列表。",
			},
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "categorySlug1", label: "分类1 Slug", type: "text", placeholder: "例如：clothing" },
			{ key: "categoryLabel1", label: "分类1名称", type: "text", placeholder: "例如：服饰" },
			{ key: "categorySlug2", label: "分类2 Slug", type: "text", placeholder: "例如：accessories" },
			{ key: "categoryLabel2", label: "分类2名称", type: "text", placeholder: "例如：配件" },
			{ key: "categorySlug3", label: "分类3 Slug", type: "text", placeholder: "例如：home-accessories" },
			{ key: "categoryLabel3", label: "分类3名称", type: "text", placeholder: "例如：家居" },
			{ key: "categorySlug4", label: "分类4 Slug（可选）", type: "text", placeholder: "可选" },
			{ key: "categoryLabel4", label: "分类4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "categorySlug5", label: "分类5 Slug（可选）", type: "text", placeholder: "可选" },
			{ key: "categoryLabel5", label: "分类5名称（可选）", type: "text", placeholder: "可选" },
			{ key: "categorySlug6", label: "分类6 Slug（可选）", type: "text", placeholder: "可选" },
			{ key: "categoryLabel6", label: "分类6名称（可选）", type: "text", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "product-spotlight",
		title: "单品聚焦",
		description: "主推单个商品，支持图片、价格文案和 CTA。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 13,
		puckComponent: "ProductSpotlightSection",
		defaults: {
			type: "product-spotlight",
			heading: "本周主推",
			subtitle: "选一个重点商品进行转化引导。",
			badgeText: "HOT",
			productSlug: "ascii-tee",
			productName: "ASCII Tee",
			priceText: "$39.00",
			imageUrl: "",
			imageAlt: "featured product",
			ctaLabel: "查看商品",
			ctaHref: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：本周主推" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：选一个重点商品进行转化引导。",
			},
			{ key: "badgeText", label: "角标文字", type: "text", placeholder: "例如：HOT" },
			{ key: "productSlug", label: "商品 Slug", type: "text", placeholder: "例如：ascii-tee" },
			{ key: "productName", label: "商品名称", type: "text", placeholder: "例如：ASCII Tee" },
			{ key: "priceText", label: "价格文案", type: "text", placeholder: "例如：$39.00" },
			{ key: "imageUrl", label: "商品图片", type: "imageUpload", placeholder: "上传或粘贴图片 URL" },
			{ key: "imageAlt", label: "图片 ALT", type: "text", placeholder: "例如：featured product" },
			{ key: "ctaLabel", label: "按钮文字", type: "text", placeholder: "例如：查看商品" },
			{ key: "ctaHref", label: "按钮链接（可选）", type: "url", placeholder: "留空时自动使用商品链接" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
				includeSizing: true,
			}),
		],
	},
	{
		type: "countdown",
		title: "倒计时",
		description: "活动倒计时组件，支持过期隐藏策略。",
		group: "commerce",
		tier: "advanced",
		rolloutOrder: 14,
		puckComponent: "CountdownSection",
		defaults: {
			type: "countdown",
			heading: "活动倒计时",
			subtitle: "距离活动结束还有",
			targetIso: "",
			timezoneLabel: "Asia/Shanghai",
			expiredMessage: "活动已结束",
			mode: "always",
			ctaLabel: "查看活动商品",
			ctaHref: "/products",
			style: {
				background: { mode: "token", token: "secondary" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "center",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：活动倒计时" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：距离活动结束还有" },
			{
				key: "targetIso",
				label: "目标时间（ISO）",
				type: "text",
				placeholder: "例如：2026-03-31T23:59:59+08:00",
			},
			{ key: "timezoneLabel", label: "时区标签", type: "text", placeholder: "例如：Asia/Shanghai" },
			{ key: "expiredMessage", label: "过期文案", type: "text", placeholder: "例如：活动已结束" },
			{
				key: "mode",
				label: "过期后策略",
				type: "select",
				options: [
					{ label: "仍显示（显示过期文案）", value: "always" },
					{ label: "过期后隐藏", value: "hide-after-expired" },
				],
			},
			{ key: "ctaLabel", label: "按钮文字", type: "text", placeholder: "例如：查看活动商品" },
			{ key: "ctaHref", label: "按钮链接", type: "url", placeholder: "/products" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
				includeSizing: true,
			}),
		],
	},
	{
		type: "featured-categories-auto",
		title: "自动分类推荐",
		description: "可自动拉取分类或手动维护分类入口。",
		group: "commerce",
		tier: "advanced",
		rolloutOrder: 15,
		puckComponent: "FeaturedCategoriesAutoSection",
		defaults: {
			type: "featured-categories-auto",
			heading: "推荐分类",
			subtitle: "自动展示热门分类，或切换到手动模式。",
			mode: "auto",
			autoLimit: DEFAULT_CATEGORY_LIMIT,
			columns: 3,
			manualCategorySlug1: "",
			manualCategoryLabel1: "",
			manualCategorySlug2: "",
			manualCategoryLabel2: "",
			manualCategorySlug3: "",
			manualCategoryLabel3: "",
			manualCategorySlug4: "",
			manualCategoryLabel4: "",
			manualCategorySlug5: "",
			manualCategoryLabel5: "",
			manualCategorySlug6: "",
			manualCategoryLabel6: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：推荐分类" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：自动展示热门分类，或切换到手动模式。",
			},
			{
				key: "mode",
				label: "数据来源",
				type: "select",
				options: [
					{ label: "自动（按分类列表）", value: "auto" },
					{ label: "手动配置", value: "manual" },
				],
			},
			{
				key: "autoLimit",
				label: "自动数量上限",
				type: "number",
				min: MIN_CATEGORY_LIMIT,
				max: MAX_CATEGORY_LIMIT,
			},
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "manualCategorySlug1", label: "手动分类1 Slug", type: "text", placeholder: "例如：clothing" },
			{ key: "manualCategoryLabel1", label: "手动分类1 名称", type: "text", placeholder: "例如：服饰" },
			{ key: "manualCategorySlug2", label: "手动分类2 Slug", type: "text", placeholder: "可选" },
			{ key: "manualCategoryLabel2", label: "手动分类2 名称", type: "text", placeholder: "可选" },
			{ key: "manualCategorySlug3", label: "手动分类3 Slug", type: "text", placeholder: "可选" },
			{ key: "manualCategoryLabel3", label: "手动分类3 名称", type: "text", placeholder: "可选" },
			{ key: "manualCategorySlug4", label: "手动分类4 Slug", type: "text", placeholder: "可选" },
			{ key: "manualCategoryLabel4", label: "手动分类4 名称", type: "text", placeholder: "可选" },
			{ key: "manualCategorySlug5", label: "手动分类5 Slug", type: "text", placeholder: "可选" },
			{ key: "manualCategoryLabel5", label: "手动分类5 名称", type: "text", placeholder: "可选" },
			{ key: "manualCategorySlug6", label: "手动分类6 Slug", type: "text", placeholder: "可选" },
			{ key: "manualCategoryLabel6", label: "手动分类6 名称", type: "text", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "logo-cloud",
		title: "品牌 Logo 墙",
		description: "展示合作品牌/渠道 Logo。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 16,
		puckComponent: "LogoCloudSection",
		defaults: {
			type: "logo-cloud",
			heading: "合作品牌",
			subtitle: "展示合作伙伴和渠道背书。",
			columns: 4,
			logo1Url: "",
			logo1Alt: "logo 1",
			logo2Url: "",
			logo2Alt: "logo 2",
			logo3Url: "",
			logo3Alt: "logo 3",
			logo4Url: "",
			logo4Alt: "logo 4",
			logo5Url: "",
			logo5Alt: "logo 5",
			logo6Url: "",
			logo6Alt: "logo 6",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：合作品牌" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：展示合作伙伴和渠道背书。" },
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "logo1Url", label: "Logo1 图片", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "logo1Alt", label: "Logo1 描述", type: "text", placeholder: "例如：Amazon" },
			{ key: "logo2Url", label: "Logo2 图片", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "logo2Alt", label: "Logo2 描述", type: "text", placeholder: "例如：eBay" },
			{ key: "logo3Url", label: "Logo3 图片", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "logo3Alt", label: "Logo3 描述", type: "text", placeholder: "例如：AliExpress" },
			{ key: "logo4Url", label: "Logo4 图片", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "logo4Alt", label: "Logo4 描述", type: "text", placeholder: "例如：Shopify" },
			{ key: "logo5Url", label: "Logo5 图片（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "logo5Alt", label: "Logo5 描述（可选）", type: "text", placeholder: "可选" },
			{ key: "logo6Url", label: "Logo6 图片（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "logo6Alt", label: "Logo6 描述（可选）", type: "text", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "timeline-steps",
		title: "流程时间线",
		description: "用于展示业务流程或服务步骤。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 17,
		puckComponent: "TimelineStepsSection",
		defaults: {
			type: "timeline-steps",
			heading: "服务流程",
			subtitle: "帮助客户快速理解从咨询到交付的步骤。",
			step1Title: "需求沟通",
			step1Description: "确认目标市场、产品类型和预算。",
			step2Title: "样品确认",
			step2Description: "提供样品并确认细节。",
			step3Title: "批量生产",
			step3Description: "完成排产和质检。",
			step4Title: "发货交付",
			step4Description: "按计划发货并提供跟踪。",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：服务流程" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：帮助客户快速理解流程。" },
			{ key: "step1Title", label: "步骤1标题", type: "text", placeholder: "例如：需求沟通" },
			{ key: "step1Description", label: "步骤1说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "step2Title", label: "步骤2标题", type: "text", placeholder: "例如：样品确认" },
			{ key: "step2Description", label: "步骤2说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "step3Title", label: "步骤3标题", type: "text", placeholder: "例如：批量生产" },
			{ key: "step3Description", label: "步骤3说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "step4Title", label: "步骤4标题", type: "text", placeholder: "例如：发货交付" },
			{ key: "step4Description", label: "步骤4说明", type: "textarea", placeholder: "请输入说明..." },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "collection-hero",
		title: "合集主视觉",
		description: "聚焦一个合集并提供直达入口。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 18,
		puckComponent: "CollectionHeroSection",
		defaults: {
			type: "collection-hero",
			eyebrow: "精选合集",
			heading: "按主题浏览商品",
			subtitle: "用一个主视觉区块突出重点合集。",
			collectionSlug: "featured-products",
			collectionLabel: "Featured Products",
			backgroundImageUrl: "",
			ctaLabel: "进入合集",
			ctaHref: "",
			style: {
				background: { mode: "token", token: "muted" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "eyebrow", label: "上方短标题", type: "text", placeholder: "例如：精选合集" },
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：按主题浏览商品" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：用一个主视觉区块突出重点合集。",
			},
			{ key: "collectionSlug", label: "合集 Slug", type: "collectionSlug", placeholder: "featured-products" },
			{ key: "collectionLabel", label: "合集展示名称", type: "text", placeholder: "例如：Featured Products" },
			{ key: "backgroundImageUrl", label: "背景图片", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "ctaLabel", label: "按钮文字", type: "text", placeholder: "例如：进入合集" },
			{ key: "ctaHref", label: "按钮链接（可选）", type: "url", placeholder: "留空时自动使用合集链接" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
				includeSizing: true,
			}),
		],
	},
	{
		type: "contact-quick-actions",
		title: "联系快捷入口",
		description: "展示 WhatsApp/邮箱/电话等联系动作卡片。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 19,
		puckComponent: "ContactQuickActionsSection",
		defaults: {
			type: "contact-quick-actions",
			heading: "联系我们",
			subtitle: "快速联系渠道，缩短询盘路径。",
			columns: 3,
			action1Label: "WhatsApp",
			action1Value: "+65 9000 0000",
			action1Href: "https://wa.me/6590000000",
			action1Description: "即时沟通",
			action2Label: "邮箱",
			action2Value: "sales@example.com",
			action2Href: "mailto:sales@example.com",
			action2Description: "商务合作",
			action3Label: "电话",
			action3Value: "+65 6000 0000",
			action3Href: "tel:+6560000000",
			action3Description: "工作时间接听",
			action4Label: "",
			action4Value: "",
			action4Href: "",
			action4Description: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：联系我们" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：快速联系渠道，缩短询盘路径。",
			},
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "action1Label", label: "入口1标题", type: "text", placeholder: "例如：WhatsApp" },
			{ key: "action1Value", label: "入口1值", type: "text", placeholder: "例如：+65 9000 0000" },
			{ key: "action1Href", label: "入口1链接", type: "url", placeholder: "例如：https://wa.me/..." },
			{ key: "action1Description", label: "入口1说明", type: "textarea", placeholder: "简短说明..." },
			{ key: "action2Label", label: "入口2标题", type: "text", placeholder: "例如：邮箱" },
			{ key: "action2Value", label: "入口2值", type: "text", placeholder: "例如：sales@example.com" },
			{ key: "action2Href", label: "入口2链接", type: "url", placeholder: "例如：mailto:sales@example.com" },
			{ key: "action2Description", label: "入口2说明", type: "textarea", placeholder: "简短说明..." },
			{ key: "action3Label", label: "入口3标题", type: "text", placeholder: "例如：电话" },
			{ key: "action3Value", label: "入口3值", type: "text", placeholder: "例如：+65 6000 0000" },
			{ key: "action3Href", label: "入口3链接", type: "url", placeholder: "例如：tel:+6560000000" },
			{ key: "action3Description", label: "入口3说明", type: "textarea", placeholder: "简短说明..." },
			{ key: "action4Label", label: "入口4标题（可选）", type: "text", placeholder: "可选" },
			{ key: "action4Value", label: "入口4值（可选）", type: "text", placeholder: "可选" },
			{ key: "action4Href", label: "入口4链接（可选）", type: "url", placeholder: "可选" },
			{ key: "action4Description", label: "入口4说明（可选）", type: "textarea", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "stats-counter",
		title: "数据指标",
		description: "展示关键业务数字（客户数/国家数/发货量等）。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 20,
		puckComponent: "StatsCounterSection",
		defaults: {
			type: "stats-counter",
			heading: "我们的成绩",
			subtitle: "用关键数字建立信任。",
			columns: 4,
			item1Label: "服务客户",
			item1Value: "1200",
			item1Suffix: "+",
			item2Label: "覆盖国家",
			item2Value: "42",
			item2Suffix: "",
			item3Label: "月均订单",
			item3Value: "18000",
			item3Suffix: "+",
			item4Label: "准时交付率",
			item4Value: "99",
			item4Suffix: "%",
			style: {
				background: { mode: "token", token: "secondary" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "center",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：我们的成绩" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：用关键数字建立信任。" },
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "item1Label", label: "指标1名称", type: "text", placeholder: "例如：服务客户" },
			{ key: "item1Value", label: "指标1数值", type: "text", placeholder: "例如：1200" },
			{ key: "item1Suffix", label: "指标1后缀", type: "text", placeholder: "例如：+" },
			{ key: "item2Label", label: "指标2名称", type: "text", placeholder: "例如：覆盖国家" },
			{ key: "item2Value", label: "指标2数值", type: "text", placeholder: "例如：42" },
			{ key: "item2Suffix", label: "指标2后缀", type: "text", placeholder: "例如：%" },
			{ key: "item3Label", label: "指标3名称", type: "text", placeholder: "例如：月均订单" },
			{ key: "item3Value", label: "指标3数值", type: "text", placeholder: "例如：18000" },
			{ key: "item3Suffix", label: "指标3后缀", type: "text", placeholder: "例如：+" },
			{ key: "item4Label", label: "指标4名称", type: "text", placeholder: "例如：准时交付率" },
			{ key: "item4Value", label: "指标4数值", type: "text", placeholder: "例如：99" },
			{ key: "item4Suffix", label: "指标4后缀", type: "text", placeholder: "例如：%" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "card-grid",
		title: "卡片网格",
		description: "用于展示优势、服务或场景的多卡片区块。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 21,
		puckComponent: "CardGridSection",
		defaults: {
			type: "card-grid",
			heading: "为什么选择我们",
			subtitle: "使用卡片形式展示核心优势。",
			columns: 3,
			card1Title: "快速交付",
			card1Body: "标准订单可在 72 小时内完成处理。",
			card1CtaLabel: "查看详情",
			card1CtaHref: "/default-channel/pages/shipping",
			card2Title: "质量保障",
			card2Body: "多轮质检流程，确保稳定交付。",
			card2CtaLabel: "",
			card2CtaHref: "",
			card3Title: "多渠道支持",
			card3Body: "支持邮件、电话与即时通讯对接。",
			card3CtaLabel: "",
			card3CtaHref: "",
			card4Title: "",
			card4Body: "",
			card4CtaLabel: "",
			card4CtaHref: "",
			card5Title: "",
			card5Body: "",
			card5CtaLabel: "",
			card5CtaHref: "",
			card6Title: "",
			card6Body: "",
			card6CtaLabel: "",
			card6CtaHref: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：为什么选择我们" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：使用卡片形式展示核心优势。" },
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "card1Title", label: "卡片1标题", type: "text", placeholder: "例如：快速交付" },
			{ key: "card1Body", label: "卡片1内容", type: "textarea", placeholder: "请输入说明..." },
			{ key: "card1CtaLabel", label: "卡片1按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "card1CtaHref", label: "卡片1按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "card2Title", label: "卡片2标题", type: "text", placeholder: "例如：质量保障" },
			{ key: "card2Body", label: "卡片2内容", type: "textarea", placeholder: "请输入说明..." },
			{ key: "card2CtaLabel", label: "卡片2按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "card2CtaHref", label: "卡片2按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "card3Title", label: "卡片3标题", type: "text", placeholder: "例如：多渠道支持" },
			{ key: "card3Body", label: "卡片3内容", type: "textarea", placeholder: "请输入说明..." },
			{ key: "card3CtaLabel", label: "卡片3按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "card3CtaHref", label: "卡片3按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "card4Title", label: "卡片4标题（可选）", type: "text", placeholder: "可选" },
			{ key: "card4Body", label: "卡片4内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "card4CtaLabel", label: "卡片4按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "card4CtaHref", label: "卡片4按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "card5Title", label: "卡片5标题（可选）", type: "text", placeholder: "可选" },
			{ key: "card5Body", label: "卡片5内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "card5CtaLabel", label: "卡片5按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "card5CtaHref", label: "卡片5按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "card6Title", label: "卡片6标题（可选）", type: "text", placeholder: "可选" },
			{ key: "card6Body", label: "卡片6内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "card6CtaLabel", label: "卡片6按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "card6CtaHref", label: "卡片6按钮链接（可选）", type: "url", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "newsletter-signup",
		title: "邮件订阅",
		description: "用于放置邮件订阅或营销线索采集入口。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 22,
		puckComponent: "NewsletterSignupSection",
		defaults: {
			type: "newsletter-signup",
			heading: "订阅获取最新资讯",
			subtitle: "第一时间获取新品与促销信息。",
			inputPlaceholder: "请输入邮箱地址",
			buttonLabel: "立即订阅",
			privacyNote: "提交即表示你同意接收营销邮件，可随时退订。",
			actionHref: "/default-channel/pages/support",
			style: {
				background: { mode: "token", token: "muted" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：订阅获取最新资讯" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：第一时间获取新品与促销信息。",
			},
			{ key: "inputPlaceholder", label: "输入框占位文案", type: "text", placeholder: "例如：请输入邮箱地址" },
			{ key: "buttonLabel", label: "按钮文字", type: "text", placeholder: "例如：立即订阅" },
			{
				key: "privacyNote",
				label: "隐私提示文案",
				type: "textarea",
				placeholder: "例如：提交即表示你同意...",
			},
			{
				key: "actionHref",
				label: "提交后跳转链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/support",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "video-embed",
		title: "视频区块",
		description: "用于展示介绍视频（YouTube/Vimeo/直链视频）。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 23,
		puckComponent: "VideoEmbedSection",
		defaults: {
			type: "video-embed",
			heading: "观看产品介绍",
			subtitle: "通过视频更直观展示产品能力。",
			videoUrl: "",
			posterImageUrl: "",
			aspectRatio: "16-9",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：观看产品介绍" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：通过视频更直观展示产品能力。",
			},
			{ key: "videoUrl", label: "视频链接", type: "url", placeholder: "支持 YouTube/Vimeo/MP4 链接" },
			{ key: "posterImageUrl", label: "封面图（可选）", type: "imageUpload", placeholder: "可选" },
			{
				key: "aspectRatio",
				label: "画面比例",
				type: "select",
				options: [
					{ label: "16:9", value: "16-9" },
					{ label: "4:3", value: "4-3" },
					{ label: "1:1", value: "1-1" },
				],
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "announcement-bar",
		title: "公告条",
		description: "顶部促销/通知条，支持时间窗口和可关闭模式。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 24,
		puckComponent: "AnnouncementBarSection",
		defaults: {
			type: "announcement-bar",
			message: "限时优惠：全场满 99 包邮",
			ctaLabel: "立即查看",
			ctaHref: "/products",
			scheduleMode: "always",
			scheduleStartIso: "",
			scheduleEndIso: "",
			dismissMode: "dismissible",
			style: {
				background: { mode: "token", token: "accent" },
				container: { width: "full", maxWidth: "xl" },
				spacing: { top: "none", bottom: "none" },
				alignment: "center",
				shape: { radius: "none", shadow: "none" },
			},
		},
		fields: [
			{ key: "message", label: "公告内容", type: "text", placeholder: "例如：限时优惠：全场满 99 包邮" },
			{ key: "ctaLabel", label: "按钮文字（可选）", type: "text", placeholder: "例如：立即查看" },
			{ key: "ctaHref", label: "按钮链接（可选）", type: "url", placeholder: "/products" },
			{
				key: "scheduleMode",
				label: "展示策略",
				type: "select",
				options: [
					{ label: "一直显示", value: "always" },
					{ label: "按时间窗口显示", value: "window" },
				],
			},
			{
				key: "scheduleStartIso",
				label: "开始时间（ISO，可选）",
				type: "text",
				placeholder: "2026-03-01T00:00:00+08:00",
			},
			{
				key: "scheduleEndIso",
				label: "结束时间（ISO，可选）",
				type: "text",
				placeholder: "2026-03-31T23:59:59+08:00",
			},
			{
				key: "dismissMode",
				label: "关闭行为",
				type: "select",
				options: [
					{ label: "不可关闭", value: "fixed" },
					{ label: "可关闭（本地浏览器）", value: "dismissible" },
				],
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeSpacing: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "trust-badges",
		title: "信任徽章",
		description: "展示支付/物流/售后等信任信息。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 25,
		puckComponent: "TrustBadgesSection",
		defaults: {
			type: "trust-badges",
			heading: "放心购买",
			subtitle: "我们提供稳定交付与完善售后支持。",
			columns: 3,
			badge1Icon: "🚚",
			badge1Title: "快速发货",
			badge1Description: "常规订单 24-72 小时内发出",
			badge2Icon: "🛡️",
			badge2Title: "质量保障",
			badge2Description: "严格质检与售后支持",
			badge3Icon: "💳",
			badge3Title: "安全支付",
			badge3Description: "支持多种安全支付方式",
			badge4Icon: "",
			badge4Title: "",
			badge4Description: "",
			badge5Icon: "",
			badge5Title: "",
			badge5Description: "",
			badge6Icon: "",
			badge6Title: "",
			badge6Description: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "center",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：放心购买" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：我们提供稳定交付与完善售后支持。",
			},
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "badge1Icon", label: "徽章1图标", type: "text", placeholder: "例如：🚚" },
			{ key: "badge1Title", label: "徽章1标题", type: "text", placeholder: "例如：快速发货" },
			{
				key: "badge1Description",
				label: "徽章1说明",
				type: "textarea",
				placeholder: "例如：常规订单 24-72 小时内发出",
			},
			{ key: "badge2Icon", label: "徽章2图标", type: "text", placeholder: "例如：🛡️" },
			{ key: "badge2Title", label: "徽章2标题", type: "text", placeholder: "例如：质量保障" },
			{
				key: "badge2Description",
				label: "徽章2说明",
				type: "textarea",
				placeholder: "例如：严格质检与售后支持",
			},
			{ key: "badge3Icon", label: "徽章3图标", type: "text", placeholder: "例如：💳" },
			{ key: "badge3Title", label: "徽章3标题", type: "text", placeholder: "例如：安全支付" },
			{
				key: "badge3Description",
				label: "徽章3说明",
				type: "textarea",
				placeholder: "例如：支持多种安全支付方式",
			},
			{ key: "badge4Icon", label: "徽章4图标（可选）", type: "text", placeholder: "可选" },
			{ key: "badge4Title", label: "徽章4标题（可选）", type: "text", placeholder: "可选" },
			{ key: "badge4Description", label: "徽章4说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "badge5Icon", label: "徽章5图标（可选）", type: "text", placeholder: "可选" },
			{ key: "badge5Title", label: "徽章5标题（可选）", type: "text", placeholder: "可选" },
			{ key: "badge5Description", label: "徽章5说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "badge6Icon", label: "徽章6图标（可选）", type: "text", placeholder: "可选" },
			{ key: "badge6Title", label: "徽章6标题（可选）", type: "text", placeholder: "可选" },
			{ key: "badge6Description", label: "徽章6说明（可选）", type: "textarea", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "contact-form-lite",
		title: "轻量联系表单",
		description: "用于收集姓名/邮箱/留言并跳转到指定处理入口。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 26,
		puckComponent: "ContactFormLiteSection",
		defaults: {
			type: "contact-form-lite",
			heading: "联系我们",
			subtitle: "留下你的需求，我们会尽快联系。",
			namePlaceholder: "你的姓名",
			emailPlaceholder: "你的邮箱",
			messagePlaceholder: "请描述你的需求...",
			submitLabel: "提交咨询",
			actionHref: "mailto:sales@example.com",
			privacyNote: "提交即表示你同意我们处理你的联系信息。",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：联系我们" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：留下你的需求，我们会尽快联系。",
			},
			{ key: "namePlaceholder", label: "姓名占位文案", type: "text", placeholder: "例如：你的姓名" },
			{ key: "emailPlaceholder", label: "邮箱占位文案", type: "text", placeholder: "例如：你的邮箱" },
			{
				key: "messagePlaceholder",
				label: "留言占位文案",
				type: "text",
				placeholder: "例如：请描述你的需求...",
			},
			{ key: "submitLabel", label: "提交按钮文字", type: "text", placeholder: "例如：提交咨询" },
			{
				key: "actionHref",
				label: "提交后跳转（可选）",
				type: "url",
				placeholder: "mailto:sales@example.com",
			},
			{
				key: "privacyNote",
				label: "隐私提示文案",
				type: "textarea",
				placeholder: "例如：提交即表示你同意...",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "tabs-content",
		title: "标签内容",
		description: "用于功能/规格分组展示，移动端自动回落为手风琴。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 27,
		puckComponent: "TabsContentSection",
		defaults: {
			type: "tabs-content",
			heading: "核心功能",
			subtitle: "按标签查看产品能力与规格说明。",
			defaultTab: 1,
			tab1Label: "功能亮点",
			tab1Body: "这里展示功能亮点说明。",
			tab2Label: "技术规格",
			tab2Body: "这里展示技术规格参数。",
			tab3Label: "适用场景",
			tab3Body: "这里展示使用场景建议。",
			tab4Label: "",
			tab4Body: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：核心功能" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：按标签查看产品能力与规格说明。",
			},
			{
				key: "defaultTab",
				label: "默认标签",
				type: "select",
				options: [
					{ label: "标签1", value: "1" },
					{ label: "标签2", value: "2" },
					{ label: "标签3", value: "3" },
					{ label: "标签4", value: "4" },
				],
			},
			{ key: "tab1Label", label: "标签1名称", type: "text", placeholder: "例如：功能亮点" },
			{ key: "tab1Body", label: "标签1内容", type: "textarea", placeholder: "请输入说明..." },
			{ key: "tab2Label", label: "标签2名称", type: "text", placeholder: "例如：技术规格" },
			{ key: "tab2Body", label: "标签2内容", type: "textarea", placeholder: "请输入说明..." },
			{ key: "tab3Label", label: "标签3名称", type: "text", placeholder: "例如：适用场景" },
			{ key: "tab3Body", label: "标签3内容", type: "textarea", placeholder: "请输入说明..." },
			{ key: "tab4Label", label: "标签4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "tab4Body", label: "标签4内容（可选）", type: "textarea", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "before-after",
		title: "前后对比",
		description: "通过双图展示改造前后、使用前后等变化效果。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 28,
		puckComponent: "BeforeAfterSection",
		defaults: {
			type: "before-after",
			heading: "前后对比",
			subtitle: "通过真实图片展示效果变化。",
			layout: "horizontal",
			beforeLabel: "改造前",
			beforeImageUrl: "",
			beforeImageAlt: "before",
			afterLabel: "改造后",
			afterImageUrl: "",
			afterImageAlt: "after",
			ctaLabel: "",
			ctaHref: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：前后对比" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：通过真实图片展示效果变化。" },
			{
				key: "layout",
				label: "布局",
				type: "select",
				options: [
					{ label: "横向并排", value: "horizontal" },
					{ label: "纵向堆叠", value: "vertical" },
				],
			},
			{ key: "beforeLabel", label: "前图标签", type: "text", placeholder: "例如：改造前" },
			{ key: "beforeImageUrl", label: "前图", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "beforeImageAlt", label: "前图描述", type: "text", placeholder: "例如：before" },
			{ key: "afterLabel", label: "后图标签", type: "text", placeholder: "例如：改造后" },
			{ key: "afterImageUrl", label: "后图", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "afterImageAlt", label: "后图描述", type: "text", placeholder: "例如：after" },
			{ key: "ctaLabel", label: "按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "ctaHref", label: "按钮链接（可选）", type: "url", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "social-proof-feed",
		title: "社交证明",
		description: "结构化展示客户评价/案例片段，提升信任感。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 29,
		puckComponent: "SocialProofFeedSection",
		defaults: {
			type: "social-proof-feed",
			heading: "客户怎么说",
			subtitle: "真实反馈，帮助新访客快速建立信任。",
			columns: 2,
			item1Quote: "交期稳定，沟通响应非常快。",
			item1Author: "Ethan H.",
			item1Meta: "配件贸易商",
			item1ImageUrl: "",
			item2Quote: "产品一致性好，返单效率高。",
			item2Author: "Linda Z.",
			item2Meta: "跨境卖家",
			item2ImageUrl: "",
			item3Quote: "",
			item3Author: "",
			item3Meta: "",
			item3ImageUrl: "",
			item4Quote: "",
			item4Author: "",
			item4Meta: "",
			item4ImageUrl: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：客户怎么说" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：真实反馈，帮助新访客快速建立信任。",
			},
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "item1Quote", label: "评价1内容", type: "textarea", placeholder: "请输入评价..." },
			{ key: "item1Author", label: "评价1作者", type: "text", placeholder: "例如：Ethan H." },
			{ key: "item1Meta", label: "评价1补充", type: "text", placeholder: "例如：配件贸易商" },
			{ key: "item1ImageUrl", label: "评价1头像（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "item2Quote", label: "评价2内容", type: "textarea", placeholder: "请输入评价..." },
			{ key: "item2Author", label: "评价2作者", type: "text", placeholder: "例如：Linda Z." },
			{ key: "item2Meta", label: "评价2补充", type: "text", placeholder: "例如：跨境卖家" },
			{ key: "item2ImageUrl", label: "评价2头像（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "item3Quote", label: "评价3内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "item3Author", label: "评价3作者（可选）", type: "text", placeholder: "可选" },
			{ key: "item3Meta", label: "评价3补充（可选）", type: "text", placeholder: "可选" },
			{ key: "item3ImageUrl", label: "评价3头像（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "item4Quote", label: "评价4内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "item4Author", label: "评价4作者（可选）", type: "text", placeholder: "可选" },
			{ key: "item4Meta", label: "评价4补充（可选）", type: "text", placeholder: "可选" },
			{ key: "item4ImageUrl", label: "评价4头像（可选）", type: "imageUpload", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "faq-compact",
		title: "简版 FAQ",
		description: "用于 PLP/PDP 落地页的紧凑型常见问题折叠区。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 30,
		puckComponent: "FaqCompactSection",
		defaults: {
			type: "faq-compact",
			heading: "常见问题",
			subtitle: "快速解答客户最关心的问题。",
			q1: "多久发货？",
			a1: "常规商品 24-72 小时内发货，定制商品以确认时间为准。",
			q2: "支持哪些支付方式？",
			a2: "支持银行卡、PayPal 及线下对公转账。",
			q3: "是否支持售后？",
			a3: "支持售后咨询与问题处理，请通过客服入口联系我们。",
			q4: "",
			a4: "",
			q5: "",
			a5: "",
			q6: "",
			a6: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：常见问题" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：快速解答客户最关心的问题。" },
			{ key: "q1", label: "问题1", type: "text", placeholder: "例如：多久发货？" },
			{ key: "a1", label: "回答1", type: "textarea", placeholder: "请输入回答..." },
			{ key: "q2", label: "问题2", type: "text", placeholder: "例如：支持哪些支付方式？" },
			{ key: "a2", label: "回答2", type: "textarea", placeholder: "请输入回答..." },
			{ key: "q3", label: "问题3", type: "text", placeholder: "例如：是否支持售后？" },
			{ key: "a3", label: "回答3", type: "textarea", placeholder: "请输入回答..." },
			{ key: "q4", label: "问题4（可选）", type: "text", placeholder: "可选" },
			{ key: "a4", label: "回答4（可选）", type: "textarea", placeholder: "可选" },
			{ key: "q5", label: "问题5（可选）", type: "text", placeholder: "可选" },
			{ key: "a5", label: "回答5（可选）", type: "textarea", placeholder: "可选" },
			{ key: "q6", label: "问题6（可选）", type: "text", placeholder: "可选" },
			{ key: "a6", label: "回答6（可选）", type: "textarea", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "metric-cards",
		title: "指标卡片",
		description: "用于 B2B 场景的 KPI 指标展示（支持图标与变化值）。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 31,
		puckComponent: "MetricCardsSection",
		defaults: {
			type: "metric-cards",
			heading: "关键业务指标",
			subtitle: "用可验证的数字建立信任。",
			columns: 3,
			item1Icon: "📦",
			item1Label: "月均发货",
			item1Value: "18,000+",
			item1Delta: "+12%",
			item2Icon: "🌍",
			item2Label: "服务国家",
			item2Value: "42",
			item2Delta: "+3",
			item3Icon: "⏱️",
			item3Label: "准时交付",
			item3Value: "99%",
			item3Delta: "+1.2%",
			item4Icon: "",
			item4Label: "",
			item4Value: "",
			item4Delta: "",
			item5Icon: "",
			item5Label: "",
			item5Value: "",
			item5Delta: "",
			item6Icon: "",
			item6Label: "",
			item6Value: "",
			item6Delta: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：关键业务指标" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：用可验证的数字建立信任。" },
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "item1Icon", label: "指标1图标", type: "text", placeholder: "例如：📦" },
			{ key: "item1Label", label: "指标1名称", type: "text", placeholder: "例如：月均发货" },
			{ key: "item1Value", label: "指标1数值", type: "text", placeholder: "例如：18,000+" },
			{ key: "item1Delta", label: "指标1变化值", type: "text", placeholder: "例如：+12%" },
			{ key: "item2Icon", label: "指标2图标", type: "text", placeholder: "例如：🌍" },
			{ key: "item2Label", label: "指标2名称", type: "text", placeholder: "例如：服务国家" },
			{ key: "item2Value", label: "指标2数值", type: "text", placeholder: "例如：42" },
			{ key: "item2Delta", label: "指标2变化值", type: "text", placeholder: "例如：+3" },
			{ key: "item3Icon", label: "指标3图标", type: "text", placeholder: "例如：⏱️" },
			{ key: "item3Label", label: "指标3名称", type: "text", placeholder: "例如：准时交付" },
			{ key: "item3Value", label: "指标3数值", type: "text", placeholder: "例如：99%" },
			{ key: "item3Delta", label: "指标3变化值", type: "text", placeholder: "例如：+1.2%" },
			{ key: "item4Icon", label: "指标4图标（可选）", type: "text", placeholder: "可选" },
			{ key: "item4Label", label: "指标4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "item4Value", label: "指标4数值（可选）", type: "text", placeholder: "可选" },
			{ key: "item4Delta", label: "指标4变化值（可选）", type: "text", placeholder: "可选" },
			{ key: "item5Icon", label: "指标5图标（可选）", type: "text", placeholder: "可选" },
			{ key: "item5Label", label: "指标5名称（可选）", type: "text", placeholder: "可选" },
			{ key: "item5Value", label: "指标5数值（可选）", type: "text", placeholder: "可选" },
			{ key: "item5Delta", label: "指标5变化值（可选）", type: "text", placeholder: "可选" },
			{ key: "item6Icon", label: "指标6图标（可选）", type: "text", placeholder: "可选" },
			{ key: "item6Label", label: "指标6名称（可选）", type: "text", placeholder: "可选" },
			{ key: "item6Value", label: "指标6数值（可选）", type: "text", placeholder: "可选" },
			{ key: "item6Delta", label: "指标6变化值（可选）", type: "text", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "media-text-split",
		title: "图文分栏",
		description: "用于图片/视频与文本并排叙事（左右可切换）。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 32,
		puckComponent: "MediaTextSplitSection",
		defaults: {
			type: "media-text-split",
			eyebrow: "场景介绍",
			heading: "用图文说明你的核心价值",
			body: "可用于品牌故事、产品能力、行业解决方案等叙事内容。",
			layout: "media-left",
			mediaType: "image",
			imageUrl: "",
			imageAlt: "media",
			videoUrl: "",
			ctaLabel: "了解更多",
			ctaHref: "/products",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "eyebrow", label: "上方短标题", type: "text", placeholder: "例如：场景介绍" },
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：用图文说明你的核心价值" },
			{ key: "body", label: "正文", type: "textarea", placeholder: "请输入正文..." },
			{
				key: "layout",
				label: "布局方向",
				type: "select",
				options: [
					{ label: "媒体在左", value: "media-left" },
					{ label: "媒体在右", value: "media-right" },
				],
			},
			{
				key: "mediaType",
				label: "媒体类型",
				type: "select",
				options: [
					{ label: "图片", value: "image" },
					{ label: "视频", value: "video" },
				],
			},
			{ key: "imageUrl", label: "图片（image 模式）", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "imageAlt", label: "图片描述", type: "text", placeholder: "例如：media" },
			{
				key: "videoUrl",
				label: "视频链接（video 模式）",
				type: "url",
				placeholder: "支持 YouTube/Vimeo/MP4",
			},
			{ key: "ctaLabel", label: "按钮文字（可选）", type: "text", placeholder: "例如：了解更多" },
			{ key: "ctaHref", label: "按钮链接（可选）", type: "url", placeholder: "/products" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "quote-highlight",
		title: "引用高亮",
		description: "用于突出客户评价或品牌主张的引用区块。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 33,
		puckComponent: "QuoteHighlightSection",
		defaults: {
			type: "quote-highlight",
			quoteText: "“与 FengQi 合作后，我们的补货效率和交付稳定性都有明显提升。”",
			authorName: "Ethan H.",
			authorTitle: "采购负责人",
			backgroundImageUrl: "",
			ctaLabel: "查看案例",
			ctaHref: "/default-channel/pages/about",
			style: {
				background: { mode: "token", token: "muted" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "center",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "quoteText", label: "引用内容", type: "textarea", placeholder: "例如：客户评价或品牌主张" },
			{ key: "authorName", label: "作者名称", type: "text", placeholder: "例如：Ethan H." },
			{ key: "authorTitle", label: "作者职位/补充", type: "text", placeholder: "例如：采购负责人" },
			{ key: "backgroundImageUrl", label: "背景图（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "ctaLabel", label: "按钮文字（可选）", type: "text", placeholder: "例如：查看案例" },
			{ key: "ctaHref", label: "按钮链接（可选）", type: "url", placeholder: "/default-channel/pages/about" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "feature-comparison",
		title: "功能对比",
		description: "用于 2-4 方案/套餐的特性对比矩阵。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 34,
		puckComponent: "FeatureComparisonSection",
		defaults: {
			type: "feature-comparison",
			heading: "方案对比",
			subtitle: "根据业务阶段选择合适方案。",
			columns: 3,
			plan1Name: "基础版",
			plan2Name: "标准版",
			plan3Name: "企业版",
			plan4Name: "",
			row1Label: "SKU 支持",
			row1Plan1: "≤ 500",
			row1Plan2: "≤ 3,000",
			row1Plan3: "不限",
			row1Plan4: "",
			row2Label: "渠道接入",
			row2Plan1: "1",
			row2Plan2: "3",
			row2Plan3: "10+",
			row2Plan4: "",
			row3Label: "客服响应",
			row3Plan1: "工单",
			row3Plan2: "工单 + IM",
			row3Plan3: "专属顾问",
			row3Plan4: "",
			row4Label: "SLA",
			row4Plan1: "标准",
			row4Plan2: "增强",
			row4Plan3: "高级",
			row4Plan4: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：方案对比" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：根据业务阶段选择合适方案。" },
			{
				key: "columns",
				label: "方案列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "plan1Name", label: "方案1名称", type: "text", placeholder: "例如：基础版" },
			{ key: "plan2Name", label: "方案2名称", type: "text", placeholder: "例如：标准版" },
			{ key: "plan3Name", label: "方案3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "plan4Name", label: "方案4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "row1Label", label: "特性1名称", type: "text", placeholder: "例如：SKU 支持" },
			{ key: "row1Plan1", label: "特性1-方案1", type: "text", placeholder: "例如：≤ 500" },
			{ key: "row1Plan2", label: "特性1-方案2", type: "text", placeholder: "例如：≤ 3000" },
			{ key: "row1Plan3", label: "特性1-方案3（可选）", type: "text", placeholder: "可选" },
			{ key: "row1Plan4", label: "特性1-方案4（可选）", type: "text", placeholder: "可选" },
			{ key: "row2Label", label: "特性2名称", type: "text", placeholder: "例如：渠道接入" },
			{ key: "row2Plan1", label: "特性2-方案1", type: "text", placeholder: "例如：1" },
			{ key: "row2Plan2", label: "特性2-方案2", type: "text", placeholder: "例如：3" },
			{ key: "row2Plan3", label: "特性2-方案3（可选）", type: "text", placeholder: "可选" },
			{ key: "row2Plan4", label: "特性2-方案4（可选）", type: "text", placeholder: "可选" },
			{ key: "row3Label", label: "特性3名称", type: "text", placeholder: "例如：客服响应" },
			{ key: "row3Plan1", label: "特性3-方案1", type: "text", placeholder: "例如：工单" },
			{ key: "row3Plan2", label: "特性3-方案2", type: "text", placeholder: "例如：工单 + IM" },
			{ key: "row3Plan3", label: "特性3-方案3（可选）", type: "text", placeholder: "可选" },
			{ key: "row3Plan4", label: "特性3-方案4（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Label", label: "特性4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Plan1", label: "特性4-方案1（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Plan2", label: "特性4-方案2（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Plan3", label: "特性4-方案3（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Plan4", label: "特性4-方案4（可选）", type: "text", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "inline-cta-banner",
		title: "行内 CTA 横幅",
		description: "用于集合页/PDP 落地页的紧凑行动召唤条。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 35,
		puckComponent: "InlineCtaBannerSection",
		defaults: {
			type: "inline-cta-banner",
			message: "需要快速报价？联系我们获取专属方案。",
			ctaLabel: "立即咨询",
			ctaHref: "mailto:sales@example.com",
			secondaryCtaLabel: "查看产品",
			secondaryCtaHref: "/products",
			compactMode: "on",
			style: {
				background: { mode: "token", token: "accent" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "sm", bottom: "sm" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{
				key: "message",
				label: "横幅文案",
				type: "text",
				placeholder: "例如：需要快速报价？联系我们获取专属方案。",
			},
			{ key: "ctaLabel", label: "主按钮文字", type: "text", placeholder: "例如：立即咨询" },
			{ key: "ctaHref", label: "主按钮链接", type: "url", placeholder: "mailto:sales@example.com" },
			{ key: "secondaryCtaLabel", label: "次按钮文字（可选）", type: "text", placeholder: "例如：查看产品" },
			{ key: "secondaryCtaHref", label: "次按钮链接（可选）", type: "url", placeholder: "/products" },
			{
				key: "compactMode",
				label: "紧凑模式",
				type: "select",
				options: [
					{ label: "开启", value: "on" },
					{ label: "关闭", value: "off" },
				],
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "logo-strip-compact",
		title: "紧凑 Logo 条",
		description: "用于展示合作伙伴/支付方式的紧凑 Logo 横向条。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 36,
		puckComponent: "LogoStripCompactSection",
		defaults: {
			type: "logo-strip-compact",
			heading: "合作品牌",
			subtitle: "我们与以下品牌/平台长期合作。",
			logo1Url: "",
			logo1Alt: "logo1",
			logo1Href: "",
			logo2Url: "",
			logo2Alt: "logo2",
			logo2Href: "",
			logo3Url: "",
			logo3Alt: "logo3",
			logo3Href: "",
			logo4Url: "",
			logo4Alt: "logo4",
			logo4Href: "",
			logo5Url: "",
			logo5Alt: "logo5",
			logo5Href: "",
			logo6Url: "",
			logo6Alt: "logo6",
			logo6Href: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "sm", bottom: "sm" },
				alignment: "center",
				shape: { radius: "sm", shadow: "none" },
			},
		},
		fields: [
			{ key: "heading", label: "标题（可选）", type: "text", placeholder: "例如：合作品牌" },
			{
				key: "subtitle",
				label: "副标题（可选）",
				type: "textarea",
				placeholder: "例如：我们与以下品牌长期合作。",
			},
			{ key: "logo1Url", label: "Logo1", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "logo1Alt", label: "Logo1 描述", type: "text", placeholder: "例如：logo1" },
			{ key: "logo1Href", label: "Logo1 链接（可选）", type: "url", placeholder: "可选" },
			{ key: "logo2Url", label: "Logo2", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "logo2Alt", label: "Logo2 描述", type: "text", placeholder: "例如：logo2" },
			{ key: "logo2Href", label: "Logo2 链接（可选）", type: "url", placeholder: "可选" },
			{ key: "logo3Url", label: "Logo3", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "logo3Alt", label: "Logo3 描述", type: "text", placeholder: "例如：logo3" },
			{ key: "logo3Href", label: "Logo3 链接（可选）", type: "url", placeholder: "可选" },
			{ key: "logo4Url", label: "Logo4（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "logo4Alt", label: "Logo4 描述（可选）", type: "text", placeholder: "可选" },
			{ key: "logo4Href", label: "Logo4 链接（可选）", type: "url", placeholder: "可选" },
			{ key: "logo5Url", label: "Logo5（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "logo5Alt", label: "Logo5 描述（可选）", type: "text", placeholder: "可选" },
			{ key: "logo5Href", label: "Logo5 链接（可选）", type: "url", placeholder: "可选" },
			{ key: "logo6Url", label: "Logo6（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "logo6Alt", label: "Logo6 描述（可选）", type: "text", placeholder: "可选" },
			{ key: "logo6Href", label: "Logo6 链接（可选）", type: "url", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "event-highlights",
		title: "事件亮点",
		description: "用于展示里程碑或活动时间线（时间轴/卡片布局）。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 37,
		puckComponent: "EventHighlightsSection",
		defaults: {
			type: "event-highlights",
			heading: "里程碑事件",
			subtitle: "展示团队近期的重要进展与活动。",
			layout: "timeline",
			event1Date: "2026-01",
			event1Title: "跨境站点上线",
			event1Description: "完成多租户 storefront builder 第一阶段。",
			event2Date: "2026-02",
			event2Title: "订单处理优化",
			event2Description: "发布批量处理与状态回传改进。",
			event3Date: "",
			event3Title: "",
			event3Description: "",
			event4Date: "",
			event4Title: "",
			event4Description: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：里程碑事件" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：展示团队近期的重要进展与活动。",
			},
			{
				key: "layout",
				label: "布局",
				type: "select",
				options: [
					{ label: "时间轴", value: "timeline" },
					{ label: "卡片", value: "cards" },
				],
			},
			{ key: "event1Date", label: "事件1日期", type: "text", placeholder: "例如：2026-01" },
			{ key: "event1Title", label: "事件1标题", type: "text", placeholder: "例如：跨境站点上线" },
			{ key: "event1Description", label: "事件1说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "event2Date", label: "事件2日期", type: "text", placeholder: "例如：2026-02" },
			{ key: "event2Title", label: "事件2标题", type: "text", placeholder: "例如：订单处理优化" },
			{ key: "event2Description", label: "事件2说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "event3Date", label: "事件3日期（可选）", type: "text", placeholder: "可选" },
			{ key: "event3Title", label: "事件3标题（可选）", type: "text", placeholder: "可选" },
			{ key: "event3Description", label: "事件3说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "event4Date", label: "事件4日期（可选）", type: "text", placeholder: "可选" },
			{ key: "event4Title", label: "事件4标题（可选）", type: "text", placeholder: "可选" },
			{ key: "event4Description", label: "事件4说明（可选）", type: "textarea", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "cta-card-pair",
		title: "双 CTA 卡片",
		description: "用于展示两个并列行动入口（如“联系销售/查看产品”）。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 38,
		puckComponent: "CtaCardPairSection",
		defaults: {
			type: "cta-card-pair",
			heading: "下一步你想做什么？",
			subtitle: "选择最适合你的入口。",
			card1Title: "联系销售顾问",
			card1Body: "获取定制报价与上线建议。",
			card1CtaLabel: "立即咨询",
			card1CtaHref: "mailto:sales@example.com",
			card1ImageUrl: "",
			card2Title: "浏览产品目录",
			card2Body: "查看可售产品与规格详情。",
			card2CtaLabel: "查看产品",
			card2CtaHref: "/products",
			card2ImageUrl: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：下一步你想做什么？" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：选择最适合你的入口。" },
			{ key: "card1Title", label: "卡片1标题", type: "text", placeholder: "例如：联系销售顾问" },
			{ key: "card1Body", label: "卡片1说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "card1CtaLabel", label: "卡片1按钮文字", type: "text", placeholder: "例如：立即咨询" },
			{ key: "card1CtaHref", label: "卡片1按钮链接", type: "url", placeholder: "mailto:sales@example.com" },
			{ key: "card1ImageUrl", label: "卡片1图片（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "card2Title", label: "卡片2标题", type: "text", placeholder: "例如：浏览产品目录" },
			{ key: "card2Body", label: "卡片2说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "card2CtaLabel", label: "卡片2按钮文字", type: "text", placeholder: "例如：查看产品" },
			{ key: "card2CtaHref", label: "卡片2按钮链接", type: "url", placeholder: "/products" },
			{ key: "card2ImageUrl", label: "卡片2图片（可选）", type: "imageUpload", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "faq-with-cta",
		title: "FAQ + 侧边 CTA",
		description: "常见问题列表与侧边行动卡片组合。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 39,
		puckComponent: "FaqWithCtaSection",
		defaults: {
			type: "faq-with-cta",
			heading: "常见问题",
			subtitle: "以下是客户最常问的问题。",
			q1: "多久可以上线？",
			a1: "一般 1-2 周可完成首版上线，视素材和配置复杂度而定。",
			q2: "是否支持多语言？",
			a2: "支持，可按渠道配置语言与内容。",
			q3: "",
			a3: "",
			q4: "",
			a4: "",
			ctaTitle: "还有问题？",
			ctaBody: "联系我们获取一对一咨询建议。",
			ctaLabel: "联系顾问",
			ctaHref: "mailto:sales@example.com",
			ctaImageUrl: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：常见问题" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：以下是客户最常问的问题。" },
			{ key: "q1", label: "问题1", type: "text", placeholder: "例如：多久可以上线？" },
			{ key: "a1", label: "回答1", type: "textarea", placeholder: "请输入回答..." },
			{ key: "q2", label: "问题2", type: "text", placeholder: "例如：是否支持多语言？" },
			{ key: "a2", label: "回答2", type: "textarea", placeholder: "请输入回答..." },
			{ key: "q3", label: "问题3（可选）", type: "text", placeholder: "可选" },
			{ key: "a3", label: "回答3（可选）", type: "textarea", placeholder: "可选" },
			{ key: "q4", label: "问题4（可选）", type: "text", placeholder: "可选" },
			{ key: "a4", label: "回答4（可选）", type: "textarea", placeholder: "可选" },
			{ key: "ctaTitle", label: "CTA 标题", type: "text", placeholder: "例如：还有问题？" },
			{ key: "ctaBody", label: "CTA 说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "ctaLabel", label: "CTA 按钮文字", type: "text", placeholder: "例如：联系顾问" },
			{ key: "ctaHref", label: "CTA 按钮链接", type: "url", placeholder: "mailto:sales@example.com" },
			{ key: "ctaImageUrl", label: "CTA 图片（可选）", type: "imageUpload", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "partner-metrics",
		title: "合作伙伴数据条",
		description: "品牌 Logo 与关键指标混合展示。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 40,
		puckComponent: "PartnerMetricsSection",
		defaults: {
			type: "partner-metrics",
			heading: "合作伙伴与成果",
			subtitle: "用品牌背书 + 数据指标提升信任。",
			columns: 4,
			item1LogoUrl: "",
			item1LogoAlt: "伙伴1",
			item1Metric: "120+",
			item1Label: "合作品牌",
			item2LogoUrl: "",
			item2LogoAlt: "伙伴2",
			item2Metric: "99.9%",
			item2Label: "系统可用性",
			item3LogoUrl: "",
			item3LogoAlt: "伙伴3",
			item3Metric: "48h",
			item3Label: "上线周期",
			item4LogoUrl: "",
			item4LogoAlt: "伙伴4",
			item4Metric: "24/7",
			item4Label: "运维支持",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "sm", bottom: "sm" },
				alignment: "center",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：合作伙伴与成果" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：用品牌背书 + 数据指标提升信任。",
			},
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "item1LogoUrl", label: "项1 Logo（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "item1LogoAlt", label: "项1 Logo 描述", type: "text", placeholder: "例如：伙伴1" },
			{ key: "item1Metric", label: "项1 指标", type: "text", placeholder: "例如：120+" },
			{ key: "item1Label", label: "项1 说明", type: "text", placeholder: "例如：合作品牌" },
			{ key: "item2LogoUrl", label: "项2 Logo（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "item2LogoAlt", label: "项2 Logo 描述", type: "text", placeholder: "例如：伙伴2" },
			{ key: "item2Metric", label: "项2 指标", type: "text", placeholder: "例如：99.9%" },
			{ key: "item2Label", label: "项2 说明", type: "text", placeholder: "例如：系统可用性" },
			{ key: "item3LogoUrl", label: "项3 Logo（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "item3LogoAlt", label: "项3 Logo 描述", type: "text", placeholder: "例如：伙伴3" },
			{ key: "item3Metric", label: "项3 指标", type: "text", placeholder: "例如：48h" },
			{ key: "item3Label", label: "项3 说明", type: "text", placeholder: "例如：上线周期" },
			{ key: "item4LogoUrl", label: "项4 Logo（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "item4LogoAlt", label: "项4 Logo 描述", type: "text", placeholder: "例如：伙伴4" },
			{ key: "item4Metric", label: "项4 指标", type: "text", placeholder: "例如：24/7" },
			{ key: "item4Label", label: "项4 说明", type: "text", placeholder: "例如：运维支持" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "story-steps",
		title: "故事步骤卡",
		description: "以步骤卡形式展示业务流程/品牌故事。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 41,
		puckComponent: "StoryStepsSection",
		defaults: {
			type: "story-steps",
			heading: "服务流程",
			subtitle: "用 3-4 步讲清楚你如何交付价值。",
			layout: "cards",
			step1Title: "需求沟通",
			step1Body: "梳理目标、用户和渠道策略。",
			step1ImageUrl: "",
			step2Title: "方案配置",
			step2Body: "完成主题、页面和商品结构配置。",
			step2ImageUrl: "",
			step3Title: "上线验证",
			step3Body: "联调支付、物流和关键流程。",
			step3ImageUrl: "",
			step4Title: "",
			step4Body: "",
			step4ImageUrl: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：服务流程" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：用 3-4 步讲清楚你如何交付价值。",
			},
			{
				key: "layout",
				label: "布局",
				type: "select",
				options: [
					{ label: "卡片", value: "cards" },
					{ label: "时间线", value: "timeline" },
				],
			},
			{ key: "step1Title", label: "步骤1标题", type: "text", placeholder: "例如：需求沟通" },
			{ key: "step1Body", label: "步骤1说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "step1ImageUrl", label: "步骤1图片（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "step2Title", label: "步骤2标题", type: "text", placeholder: "例如：方案配置" },
			{ key: "step2Body", label: "步骤2说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "step2ImageUrl", label: "步骤2图片（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "step3Title", label: "步骤3标题", type: "text", placeholder: "例如：上线验证" },
			{ key: "step3Body", label: "步骤3说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "step3ImageUrl", label: "步骤3图片（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "step4Title", label: "步骤4标题（可选）", type: "text", placeholder: "可选" },
			{ key: "step4Body", label: "步骤4说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "step4ImageUrl", label: "步骤4图片（可选）", type: "imageUpload", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "media-carousel",
		title: "媒体轮播",
		description: "多图轮播主视觉，支持每张图独立文案与按钮。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 42,
		puckComponent: "MediaCarouselSection",
		defaults: {
			type: "media-carousel",
			heading: "品牌主视觉",
			subtitle: "用 2-3 张重点画面展示核心卖点。",
			autoplay: "on",
			slide1ImageUrl: "",
			slide1Title: "主打产品",
			slide1Body: "突出你的核心价值与应用场景。",
			slide1CtaLabel: "立即查看",
			slide1CtaHref: "/products",
			slide2ImageUrl: "",
			slide2Title: "行业方案",
			slide2Body: "展示行业落地案例与成效。",
			slide2CtaLabel: "了解方案",
			slide2CtaHref: "/pages/solutions",
			slide3ImageUrl: "",
			slide3Title: "",
			slide3Body: "",
			slide3CtaLabel: "",
			slide3CtaHref: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：品牌主视觉" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：用 2-3 张重点画面展示核心卖点。",
			},
			{
				key: "autoplay",
				label: "自动轮播",
				type: "select",
				options: [
					{ label: "开启", value: "on" },
					{ label: "关闭", value: "off" },
				],
			},
			{ key: "slide1ImageUrl", label: "轮播1图片", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "slide1Title", label: "轮播1标题", type: "text", placeholder: "例如：主打产品" },
			{ key: "slide1Body", label: "轮播1说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "slide1CtaLabel", label: "轮播1按钮文字", type: "text", placeholder: "例如：立即查看" },
			{ key: "slide1CtaHref", label: "轮播1按钮链接", type: "url", placeholder: "/products" },
			{ key: "slide2ImageUrl", label: "轮播2图片（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "slide2Title", label: "轮播2标题（可选）", type: "text", placeholder: "可选" },
			{ key: "slide2Body", label: "轮播2说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "slide2CtaLabel", label: "轮播2按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "slide2CtaHref", label: "轮播2按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "slide3ImageUrl", label: "轮播3图片（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "slide3Title", label: "轮播3标题（可选）", type: "text", placeholder: "可选" },
			{ key: "slide3Body", label: "轮播3说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "slide3CtaLabel", label: "轮播3按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "slide3CtaHref", label: "轮播3按钮链接（可选）", type: "url", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "feature-checklist",
		title: "功能清单",
		description: "图标/勾选风格的功能卖点清单，支持 CTA。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 43,
		puckComponent: "FeatureChecklistSection",
		defaults: {
			type: "feature-checklist",
			heading: "为什么选择我们",
			subtitle: "以下能力帮助你更快上线并稳定运营。",
			item1: "多租户隔离与域名独立",
			item2: "可视化搭建首页与落地页",
			item3: "主题化配置与品牌统一",
			item4: "缓存回刷与发布流程完备",
			item5: "",
			item6: "",
			item7: "",
			item8: "",
			ctaLabel: "开始使用",
			ctaHref: "/products",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：为什么选择我们" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：以下能力帮助你更快上线并稳定运营。",
			},
			{ key: "item1", label: "条目1", type: "text", placeholder: "请输入条目..." },
			{ key: "item2", label: "条目2", type: "text", placeholder: "请输入条目..." },
			{ key: "item3", label: "条目3", type: "text", placeholder: "请输入条目..." },
			{ key: "item4", label: "条目4", type: "text", placeholder: "请输入条目..." },
			{ key: "item5", label: "条目5（可选）", type: "text", placeholder: "可选" },
			{ key: "item6", label: "条目6（可选）", type: "text", placeholder: "可选" },
			{ key: "item7", label: "条目7（可选）", type: "text", placeholder: "可选" },
			{ key: "item8", label: "条目8（可选）", type: "text", placeholder: "可选" },
			{ key: "ctaLabel", label: "按钮文字（可选）", type: "text", placeholder: "例如：开始使用" },
			{ key: "ctaHref", label: "按钮链接（可选）", type: "url", placeholder: "/products" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "mini-blog-cards",
		title: "迷你文章卡片",
		description: "展示 3 条内容卡片（标题/摘要/链接/封面）。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 44,
		puckComponent: "MiniBlogCardsSection",
		defaults: {
			type: "mini-blog-cards",
			heading: "最新内容",
			subtitle: "用内容卡片承接搜索流量与品牌教育。",
			card1Title: "如何 2 周上线跨境站点",
			card1Excerpt: "从主题配置到发布流程，快速落地的关键步骤。",
			card1Href: "/pages/how-to-launch",
			card1ImageUrl: "",
			card2Title: "多租户电商架构实践",
			card2Excerpt: "隔离、缓存与运维观测的实战经验。",
			card2Href: "/pages/multi-tenant-architecture",
			card2ImageUrl: "",
			card3Title: "",
			card3Excerpt: "",
			card3Href: "",
			card3ImageUrl: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：最新内容" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：用内容卡片承接搜索流量与品牌教育。",
			},
			{ key: "card1Title", label: "卡片1标题", type: "text", placeholder: "请输入标题..." },
			{ key: "card1Excerpt", label: "卡片1摘要", type: "textarea", placeholder: "请输入摘要..." },
			{ key: "card1Href", label: "卡片1链接", type: "url", placeholder: "/pages/..." },
			{ key: "card1ImageUrl", label: "卡片1封面（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "card2Title", label: "卡片2标题（可选）", type: "text", placeholder: "可选" },
			{ key: "card2Excerpt", label: "卡片2摘要（可选）", type: "textarea", placeholder: "可选" },
			{ key: "card2Href", label: "卡片2链接（可选）", type: "url", placeholder: "可选" },
			{ key: "card2ImageUrl", label: "卡片2封面（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "card3Title", label: "卡片3标题（可选）", type: "text", placeholder: "可选" },
			{ key: "card3Excerpt", label: "卡片3摘要（可选）", type: "textarea", placeholder: "可选" },
			{ key: "card3Href", label: "卡片3链接（可选）", type: "url", placeholder: "可选" },
			{ key: "card3ImageUrl", label: "卡片3封面（可选）", type: "imageUpload", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "trust-logo-wall",
		title: "信任 Logo 墙",
		description: "密集展示合作伙伴/认证 Logo，可附分组标签。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 45,
		puckComponent: "TrustLogoWallSection",
		defaults: {
			type: "trust-logo-wall",
			heading: "他们都在使用",
			subtitle: "合作品牌与认证资质展示。",
			groupLabel: "合作伙伴",
			density: "dense",
			logo1Url: "",
			logo1Alt: "logo1",
			logo1Href: "",
			logo2Url: "",
			logo2Alt: "logo2",
			logo2Href: "",
			logo3Url: "",
			logo3Alt: "logo3",
			logo3Href: "",
			logo4Url: "",
			logo4Alt: "logo4",
			logo4Href: "",
			logo5Url: "",
			logo5Alt: "logo5",
			logo5Href: "",
			logo6Url: "",
			logo6Alt: "logo6",
			logo6Href: "",
			logo7Url: "",
			logo7Alt: "logo7",
			logo7Href: "",
			logo8Url: "",
			logo8Alt: "logo8",
			logo8Href: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "sm", bottom: "sm" },
				alignment: "center",
				shape: { radius: "sm", shadow: "none" },
			},
		},
		fields: [
			{ key: "heading", label: "标题（可选）", type: "text", placeholder: "例如：他们都在使用" },
			{
				key: "subtitle",
				label: "副标题（可选）",
				type: "textarea",
				placeholder: "例如：合作品牌与认证资质展示。",
			},
			{ key: "groupLabel", label: "分组标签（可选）", type: "text", placeholder: "例如：合作伙伴" },
			{
				key: "density",
				label: "密度",
				type: "select",
				options: [
					{ label: "常规", value: "normal" },
					{ label: "紧凑", value: "dense" },
				],
			},
			{ key: "logo1Url", label: "Logo1", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "logo1Alt", label: "Logo1 描述", type: "text", placeholder: "例如：logo1" },
			{ key: "logo1Href", label: "Logo1 链接（可选）", type: "url", placeholder: "可选" },
			{ key: "logo2Url", label: "Logo2", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "logo2Alt", label: "Logo2 描述", type: "text", placeholder: "例如：logo2" },
			{ key: "logo2Href", label: "Logo2 链接（可选）", type: "url", placeholder: "可选" },
			{ key: "logo3Url", label: "Logo3", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "logo3Alt", label: "Logo3 描述", type: "text", placeholder: "例如：logo3" },
			{ key: "logo3Href", label: "Logo3 链接（可选）", type: "url", placeholder: "可选" },
			{ key: "logo4Url", label: "Logo4", type: "imageUpload", placeholder: "上传或粘贴 URL" },
			{ key: "logo4Alt", label: "Logo4 描述", type: "text", placeholder: "例如：logo4" },
			{ key: "logo4Href", label: "Logo4 链接（可选）", type: "url", placeholder: "可选" },
			{ key: "logo5Url", label: "Logo5（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "logo5Alt", label: "Logo5 描述（可选）", type: "text", placeholder: "可选" },
			{ key: "logo5Href", label: "Logo5 链接（可选）", type: "url", placeholder: "可选" },
			{ key: "logo6Url", label: "Logo6（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "logo6Alt", label: "Logo6 描述（可选）", type: "text", placeholder: "可选" },
			{ key: "logo6Href", label: "Logo6 链接（可选）", type: "url", placeholder: "可选" },
			{ key: "logo7Url", label: "Logo7（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "logo7Alt", label: "Logo7 描述（可选）", type: "text", placeholder: "可选" },
			{ key: "logo7Href", label: "Logo7 链接（可选）", type: "url", placeholder: "可选" },
			{ key: "logo8Url", label: "Logo8（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "logo8Alt", label: "Logo8 描述（可选）", type: "text", placeholder: "可选" },
			{ key: "logo8Href", label: "Logo8 链接（可选）", type: "url", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "dual-hero-split",
		title: "双区 Hero",
		description: "左右双信息区，可配置独立文案、按钮与背景。",
		group: "layout",
		tier: "secondary",
		rolloutOrder: 46,
		puckComponent: "DualHeroSplitSection",
		defaults: {
			type: "dual-hero-split",
			heading: "选择你的业务入口",
			subtitle: "左右区块承载不同受众的核心路径。",
			leftEyebrow: "面向采购",
			leftTitle: "快速获取报价",
			leftBody: "告诉我们需求，获得匹配方案。",
			leftCtaLabel: "联系销售",
			leftCtaHref: "mailto:sales@example.com",
			leftImageUrl: "",
			leftBackgroundColor: "#f8fafc",
			rightEyebrow: "面向运营",
			rightTitle: "浏览产品目录",
			rightBody: "按品类与场景快速查找产品。",
			rightCtaLabel: "查看产品",
			rightCtaHref: "/products",
			rightImageUrl: "",
			rightBackgroundColor: "#f8fafc",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "xl" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "总标题（可选）", type: "text", placeholder: "例如：选择你的业务入口" },
			{
				key: "subtitle",
				label: "总副标题（可选）",
				type: "textarea",
				placeholder: "例如：左右区块承载不同受众的核心路径。",
			},
			{ key: "leftEyebrow", label: "左区标签", type: "text", placeholder: "例如：面向采购" },
			{ key: "leftTitle", label: "左区标题", type: "text", placeholder: "例如：快速获取报价" },
			{ key: "leftBody", label: "左区说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "leftCtaLabel", label: "左区按钮文字", type: "text", placeholder: "例如：联系销售" },
			{ key: "leftCtaHref", label: "左区按钮链接", type: "url", placeholder: "mailto:sales@example.com" },
			{ key: "leftImageUrl", label: "左区背景图（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "leftBackgroundColor", label: "左区背景色（可选）", type: "color", placeholder: "#f8fafc" },
			{ key: "rightEyebrow", label: "右区标签", type: "text", placeholder: "例如：面向运营" },
			{ key: "rightTitle", label: "右区标题", type: "text", placeholder: "例如：浏览产品目录" },
			{ key: "rightBody", label: "右区说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "rightCtaLabel", label: "右区按钮文字", type: "text", placeholder: "例如：查看产品" },
			{ key: "rightCtaHref", label: "右区按钮链接", type: "url", placeholder: "/products" },
			{ key: "rightImageUrl", label: "右区背景图（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "rightBackgroundColor", label: "右区背景色（可选）", type: "color", placeholder: "#f8fafc" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "quick-links-grid",
		title: "快捷链接网格",
		description: "核心导航入口网格，帮助访客快速跳转关键页面。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 47,
		puckComponent: "QuickLinksGridSection",
		defaults: {
			type: "quick-links-grid",
			heading: "快捷入口",
			subtitle: "常用页面与操作直达。",
			columns: 4,
			link1Label: "所有商品",
			link1Href: "/products",
			link1Icon: "🛍️",
			link2Label: "分类目录",
			link2Href: "/categories",
			link2Icon: "📂",
			link3Label: "帮助中心",
			link3Href: "/pages/help",
			link3Icon: "❓",
			link4Label: "联系我们",
			link4Href: "/pages/contact",
			link4Icon: "📞",
			link5Label: "",
			link5Href: "",
			link5Icon: "",
			link6Label: "",
			link6Href: "",
			link6Icon: "",
			link7Label: "",
			link7Href: "",
			link7Icon: "",
			link8Label: "",
			link8Href: "",
			link8Icon: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "sm", bottom: "sm" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：快捷入口" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：常用页面与操作直达。" },
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "link1Label", label: "链接1名称", type: "text", placeholder: "例如：所有商品" },
			{ key: "link1Href", label: "链接1地址", type: "url", placeholder: "/products" },
			{ key: "link1Icon", label: "链接1图标（可选）", type: "text", placeholder: "例如：🛍️" },
			{ key: "link2Label", label: "链接2名称", type: "text", placeholder: "例如：分类目录" },
			{ key: "link2Href", label: "链接2地址", type: "url", placeholder: "/categories" },
			{ key: "link2Icon", label: "链接2图标（可选）", type: "text", placeholder: "例如：📂" },
			{ key: "link3Label", label: "链接3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "link3Href", label: "链接3地址（可选）", type: "url", placeholder: "可选" },
			{ key: "link3Icon", label: "链接3图标（可选）", type: "text", placeholder: "可选" },
			{ key: "link4Label", label: "链接4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "link4Href", label: "链接4地址（可选）", type: "url", placeholder: "可选" },
			{ key: "link4Icon", label: "链接4图标（可选）", type: "text", placeholder: "可选" },
			{ key: "link5Label", label: "链接5名称（可选）", type: "text", placeholder: "可选" },
			{ key: "link5Href", label: "链接5地址（可选）", type: "url", placeholder: "可选" },
			{ key: "link5Icon", label: "链接5图标（可选）", type: "text", placeholder: "可选" },
			{ key: "link6Label", label: "链接6名称（可选）", type: "text", placeholder: "可选" },
			{ key: "link6Href", label: "链接6地址（可选）", type: "url", placeholder: "可选" },
			{ key: "link6Icon", label: "链接6图标（可选）", type: "text", placeholder: "可选" },
			{ key: "link7Label", label: "链接7名称（可选）", type: "text", placeholder: "可选" },
			{ key: "link7Href", label: "链接7地址（可选）", type: "url", placeholder: "可选" },
			{ key: "link7Icon", label: "链接7图标（可选）", type: "text", placeholder: "可选" },
			{ key: "link8Label", label: "链接8名称（可选）", type: "text", placeholder: "可选" },
			{ key: "link8Href", label: "链接8地址（可选）", type: "url", placeholder: "可选" },
			{ key: "link8Icon", label: "链接8图标（可选）", type: "text", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "store-locator-lite",
		title: "门店信息（轻量）",
		description: "展示地址/电话/营业时间，并提供地图跳转。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 48,
		puckComponent: "StoreLocatorLiteSection",
		defaults: {
			type: "store-locator-lite",
			heading: "门店与服务点",
			subtitle: "选择离你最近的服务点。",
			card1Name: "深圳总部",
			card1Address: "南山区科技园示例路 88 号",
			card1Phone: "+86 755 0000 0000",
			card1Hours: "周一至周五 09:00-18:00",
			card1MapHref: "https://maps.google.com",
			card2Name: "广州服务点",
			card2Address: "天河区示例大道 66 号",
			card2Phone: "+86 20 0000 0000",
			card2Hours: "周一至周六 10:00-19:00",
			card2MapHref: "https://maps.google.com",
			card3Name: "",
			card3Address: "",
			card3Phone: "",
			card3Hours: "",
			card3MapHref: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：门店与服务点" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：选择离你最近的服务点。" },
			{ key: "card1Name", label: "门店1名称", type: "text", placeholder: "例如：深圳总部" },
			{ key: "card1Address", label: "门店1地址", type: "textarea", placeholder: "请输入地址..." },
			{ key: "card1Phone", label: "门店1电话", type: "text", placeholder: "例如：+86 755 ..." },
			{
				key: "card1Hours",
				label: "门店1营业时间",
				type: "text",
				placeholder: "例如：周一至周五 09:00-18:00",
			},
			{
				key: "card1MapHref",
				label: "门店1地图链接",
				type: "url",
				placeholder: "https://maps.google.com/...",
			},
			{ key: "card2Name", label: "门店2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "card2Address", label: "门店2地址（可选）", type: "textarea", placeholder: "可选" },
			{ key: "card2Phone", label: "门店2电话（可选）", type: "text", placeholder: "可选" },
			{ key: "card2Hours", label: "门店2营业时间（可选）", type: "text", placeholder: "可选" },
			{ key: "card2MapHref", label: "门店2地图链接（可选）", type: "url", placeholder: "可选" },
			{ key: "card3Name", label: "门店3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "card3Address", label: "门店3地址（可选）", type: "textarea", placeholder: "可选" },
			{ key: "card3Phone", label: "门店3电话（可选）", type: "text", placeholder: "可选" },
			{ key: "card3Hours", label: "门店3营业时间（可选）", type: "text", placeholder: "可选" },
			{ key: "card3MapHref", label: "门店3地图链接（可选）", type: "url", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "timeline-compact",
		title: "紧凑时间线",
		description: "短里程碑条，适合在首页快速建立信任。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 49,
		puckComponent: "TimelineCompactSection",
		defaults: {
			type: "timeline-compact",
			heading: "发展里程碑",
			subtitle: "核心节点一目了然。",
			item1Date: "2024",
			item1Title: "项目启动",
			item1Body: "完成核心架构设计。",
			item2Date: "2025",
			item2Title: "多租户上线",
			item2Body: "支持双测试租户与独立域名。",
			item3Date: "2026",
			item3Title: "可视化编辑器",
			item3Body: "上线 Puck 驱动页面搭建。",
			item4Date: "",
			item4Title: "",
			item4Body: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：发展里程碑" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：核心节点一目了然。" },
			{ key: "item1Date", label: "节点1日期", type: "text", placeholder: "例如：2024" },
			{ key: "item1Title", label: "节点1标题", type: "text", placeholder: "例如：项目启动" },
			{ key: "item1Body", label: "节点1说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "item2Date", label: "节点2日期", type: "text", placeholder: "例如：2025" },
			{ key: "item2Title", label: "节点2标题", type: "text", placeholder: "例如：多租户上线" },
			{ key: "item2Body", label: "节点2说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "item3Date", label: "节点3日期（可选）", type: "text", placeholder: "可选" },
			{ key: "item3Title", label: "节点3标题（可选）", type: "text", placeholder: "可选" },
			{ key: "item3Body", label: "节点3说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "item4Date", label: "节点4日期（可选）", type: "text", placeholder: "可选" },
			{ key: "item4Title", label: "节点4标题（可选）", type: "text", placeholder: "可选" },
			{ key: "item4Body", label: "节点4说明（可选）", type: "textarea", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "faq-cards",
		title: "FAQ 卡片",
		description: "卡片式问答，适合非技术用户快速阅读。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 50,
		puckComponent: "FaqCardsSection",
		defaults: {
			type: "faq-cards",
			heading: "常见问题",
			subtitle: "你最关心的问题都在这里。",
			columns: 3,
			q1: "可以自定义品牌吗？",
			a1: "可以，支持主题色、字体和基础布局配置。",
			q2: "多久能上线？",
			a2: "通常 1-2 周可完成首版。",
			q3: "支持多语言吗？",
			a3: "支持，可按渠道配置。",
			q4: "",
			a4: "",
			q5: "",
			a5: "",
			q6: "",
			a6: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：常见问题" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：你最关心的问题都在这里。" },
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "q1", label: "问题1", type: "text", placeholder: "请输入问题..." },
			{ key: "a1", label: "回答1", type: "textarea", placeholder: "请输入回答..." },
			{ key: "q2", label: "问题2", type: "text", placeholder: "请输入问题..." },
			{ key: "a2", label: "回答2", type: "textarea", placeholder: "请输入回答..." },
			{ key: "q3", label: "问题3（可选）", type: "text", placeholder: "可选" },
			{ key: "a3", label: "回答3（可选）", type: "textarea", placeholder: "可选" },
			{ key: "q4", label: "问题4（可选）", type: "text", placeholder: "可选" },
			{ key: "a4", label: "回答4（可选）", type: "textarea", placeholder: "可选" },
			{ key: "q5", label: "问题5（可选）", type: "text", placeholder: "可选" },
			{ key: "a5", label: "回答5（可选）", type: "textarea", placeholder: "可选" },
			{ key: "q6", label: "问题6（可选）", type: "text", placeholder: "可选" },
			{ key: "a6", label: "回答6（可选）", type: "textarea", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "product-comparison-lite",
		title: "产品对比（轻量）",
		description: "2-4 项产品快速对比，突出价格与核心特性。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 51,
		puckComponent: "ProductComparisonLiteSection",
		defaults: {
			type: "product-comparison-lite",
			heading: "产品快速对比",
			subtitle: "按预算和场景快速选择。",
			columns: 3,
			item1Name: "基础版",
			item1Price: "¥199/月",
			item1Feature: "适合小团队快速启动",
			item1CtaLabel: "查看详情",
			item1CtaHref: "/products",
			item2Name: "标准版",
			item2Price: "¥399/月",
			item2Feature: "适合成长中的多渠道业务",
			item2CtaLabel: "查看详情",
			item2CtaHref: "/products",
			item3Name: "企业版",
			item3Price: "联系销售",
			item3Feature: "适合复杂流程与高级权限",
			item3CtaLabel: "联系销售",
			item3CtaHref: "mailto:sales@example.com",
			item4Name: "",
			item4Price: "",
			item4Feature: "",
			item4CtaLabel: "",
			item4CtaHref: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：产品快速对比" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：按预算和场景快速选择。" },
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "item1Name", label: "产品1名称", type: "text", placeholder: "例如：基础版" },
			{ key: "item1Price", label: "产品1价格", type: "text", placeholder: "例如：¥199/月" },
			{ key: "item1Feature", label: "产品1卖点", type: "text", placeholder: "例如：适合小团队快速启动" },
			{ key: "item1CtaLabel", label: "产品1按钮文字", type: "text", placeholder: "例如：查看详情" },
			{ key: "item1CtaHref", label: "产品1按钮链接", type: "url", placeholder: "/products" },
			{ key: "item2Name", label: "产品2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "item2Price", label: "产品2价格（可选）", type: "text", placeholder: "可选" },
			{ key: "item2Feature", label: "产品2卖点（可选）", type: "text", placeholder: "可选" },
			{ key: "item2CtaLabel", label: "产品2按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "item2CtaHref", label: "产品2按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "item3Name", label: "产品3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "item3Price", label: "产品3价格（可选）", type: "text", placeholder: "可选" },
			{ key: "item3Feature", label: "产品3卖点（可选）", type: "text", placeholder: "可选" },
			{ key: "item3CtaLabel", label: "产品3按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "item3CtaHref", label: "产品3按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "item4Name", label: "产品4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "item4Price", label: "产品4价格（可选）", type: "text", placeholder: "可选" },
			{ key: "item4Feature", label: "产品4卖点（可选）", type: "text", placeholder: "可选" },
			{ key: "item4CtaLabel", label: "产品4按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "item4CtaHref", label: "产品4按钮链接（可选）", type: "url", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "cta-marquee",
		title: "滚动 CTA 条",
		description: "滚动促销信息条，附安全 CTA 链接。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 52,
		puckComponent: "CtaMarqueeSection",
		defaults: {
			type: "cta-marquee",
			message: "限时活动：新用户首单立减 10%",
			secondaryMessage: "支持多语言与多租户独立域名",
			ctaLabel: "立即查看",
			ctaHref: "/products",
			speed: "normal",
			pauseOnHover: "on",
			style: {
				background: { mode: "token", token: "accent" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "sm", bottom: "sm" },
				alignment: "left",
				shape: { radius: "md", shadow: "none" },
			},
		},
		fields: [
			{ key: "message", label: "主信息", type: "text", placeholder: "例如：限时活动：新用户首单立减 10%" },
			{ key: "secondaryMessage", label: "次信息（可选）", type: "text", placeholder: "可选" },
			{ key: "ctaLabel", label: "按钮文字（可选）", type: "text", placeholder: "例如：立即查看" },
			{ key: "ctaHref", label: "按钮链接（可选）", type: "url", placeholder: "/products" },
			{
				key: "speed",
				label: "滚动速度",
				type: "select",
				options: [
					{ label: "慢", value: "slow" },
					{ label: "中", value: "normal" },
					{ label: "快", value: "fast" },
				],
			},
			{
				key: "pauseOnHover",
				label: "悬停暂停",
				type: "select",
				options: [
					{ label: "开启", value: "on" },
					{ label: "关闭", value: "off" },
				],
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "faq-accordion-plus",
		title: "FAQ 分组折叠",
		description: "按主题分组的 FAQ 折叠结构，适合复杂问题。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 53,
		puckComponent: "FaqAccordionPlusSection",
		defaults: {
			type: "faq-accordion-plus",
			heading: "常见问题（分组）",
			subtitle: "按主题快速定位答案。",
			group1Title: "账号与开通",
			q1: "如何开通账号？",
			a1: "联系销售开通租户并配置域名。",
			q2: "支持多少管理员？",
			a2: "可按角色扩展多个管理员账号。",
			group2Title: "订单与发货",
			q3: "是否支持多仓发货？",
			a3: "支持，可按业务配置仓库与渠道。",
			q4: "能否导出订单？",
			a4: "支持 CSV/报表导出。",
			group3Title: "技术与运维",
			q5: "如何回滚配置？",
			a5: "Builder 支持草稿/发布与回滚。",
			q6: "如何查看监控？",
			a6: "可在监控面板查看核心指标与告警。",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：常见问题（分组）" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：按主题快速定位答案。" },
			{ key: "group1Title", label: "分组1标题", type: "text", placeholder: "例如：账号与开通" },
			{ key: "q1", label: "问题1", type: "text", placeholder: "请输入问题..." },
			{ key: "a1", label: "回答1", type: "textarea", placeholder: "请输入回答..." },
			{ key: "q2", label: "问题2（可选）", type: "text", placeholder: "可选" },
			{ key: "a2", label: "回答2（可选）", type: "textarea", placeholder: "可选" },
			{ key: "group2Title", label: "分组2标题（可选）", type: "text", placeholder: "可选" },
			{ key: "q3", label: "问题3（可选）", type: "text", placeholder: "可选" },
			{ key: "a3", label: "回答3（可选）", type: "textarea", placeholder: "可选" },
			{ key: "q4", label: "问题4（可选）", type: "text", placeholder: "可选" },
			{ key: "a4", label: "回答4（可选）", type: "textarea", placeholder: "可选" },
			{ key: "group3Title", label: "分组3标题（可选）", type: "text", placeholder: "可选" },
			{ key: "q5", label: "问题5（可选）", type: "text", placeholder: "可选" },
			{ key: "a5", label: "回答5（可选）", type: "textarea", placeholder: "可选" },
			{ key: "q6", label: "问题6（可选）", type: "text", placeholder: "可选" },
			{ key: "a6", label: "回答6（可选）", type: "textarea", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "usp-pill-row",
		title: "USP 胶囊行",
		description: "紧凑图标+文案胶囊，快速传达信任卖点。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 54,
		puckComponent: "UspPillRowSection",
		defaults: {
			type: "usp-pill-row",
			heading: "为什么选择我们",
			subtitle: "聚焦你最关心的服务与交付能力。",
			columns: 3,
			item1Icon: "⚡",
			item1Label: "快速交付",
			item2Icon: "🔒",
			item2Label: "安全可靠",
			item3Icon: "🌍",
			item3Label: "全球可达",
			item4Icon: "📈",
			item4Label: "可持续增长",
			item5Icon: "",
			item5Label: "",
			item6Icon: "",
			item6Label: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：为什么选择我们" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：聚焦你最关心的服务与交付能力。",
			},
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "item1Icon", label: "卖点1图标", type: "text", placeholder: "例如：⚡" },
			{ key: "item1Label", label: "卖点1文案", type: "text", placeholder: "例如：快速交付" },
			{ key: "item2Icon", label: "卖点2图标", type: "text", placeholder: "例如：🔒" },
			{ key: "item2Label", label: "卖点2文案", type: "text", placeholder: "例如：安全可靠" },
			{ key: "item3Icon", label: "卖点3图标", type: "text", placeholder: "例如：🌍" },
			{ key: "item3Label", label: "卖点3文案", type: "text", placeholder: "例如：全球可达" },
			{ key: "item4Icon", label: "卖点4图标（可选）", type: "text", placeholder: "可选" },
			{ key: "item4Label", label: "卖点4文案（可选）", type: "text", placeholder: "可选" },
			{ key: "item5Icon", label: "卖点5图标（可选）", type: "text", placeholder: "可选" },
			{ key: "item5Label", label: "卖点5文案（可选）", type: "text", placeholder: "可选" },
			{ key: "item6Icon", label: "卖点6图标（可选）", type: "text", placeholder: "可选" },
			{ key: "item6Label", label: "卖点6文案（可选）", type: "text", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "pricing-card-lite",
		title: "定价卡片（轻量）",
		description: "2-4 列轻量定价卡片，用于套餐与方案展示。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 55,
		puckComponent: "PricingCardLiteSection",
		defaults: {
			type: "pricing-card-lite",
			heading: "选择适合你的方案",
			subtitle: "从试用到企业级，按业务规模灵活升级。",
			columns: 3,
			plan1Name: "入门版",
			plan1Price: "¥199/月",
			plan1Feature: "基础功能 + 邮件支持",
			plan1CtaLabel: "开始使用",
			plan1CtaHref: "/products",
			plan2Name: "成长版",
			plan2Price: "¥399/月",
			plan2Feature: "高级功能 + 多渠道",
			plan2CtaLabel: "立即升级",
			plan2CtaHref: "/products",
			plan3Name: "企业版",
			plan3Price: "联系我们",
			plan3Feature: "专属支持 + 定制能力",
			plan3CtaLabel: "联系销售",
			plan3CtaHref: "mailto:sales@example.com",
			plan4Name: "",
			plan4Price: "",
			plan4Feature: "",
			plan4CtaLabel: "",
			plan4CtaHref: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：选择适合你的方案" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：从试用到企业级，按业务规模灵活升级。",
			},
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "plan1Name", label: "方案1名称", type: "text", placeholder: "例如：入门版" },
			{ key: "plan1Price", label: "方案1价格", type: "text", placeholder: "例如：¥199/月" },
			{ key: "plan1Feature", label: "方案1说明", type: "text", placeholder: "例如：基础功能 + 邮件支持" },
			{ key: "plan1CtaLabel", label: "方案1按钮文字", type: "text", placeholder: "例如：开始使用" },
			{ key: "plan1CtaHref", label: "方案1按钮链接", type: "url", placeholder: "/products" },
			{ key: "plan2Name", label: "方案2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "plan2Price", label: "方案2价格（可选）", type: "text", placeholder: "可选" },
			{ key: "plan2Feature", label: "方案2说明（可选）", type: "text", placeholder: "可选" },
			{ key: "plan2CtaLabel", label: "方案2按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "plan2CtaHref", label: "方案2按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "plan3Name", label: "方案3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "plan3Price", label: "方案3价格（可选）", type: "text", placeholder: "可选" },
			{ key: "plan3Feature", label: "方案3说明（可选）", type: "text", placeholder: "可选" },
			{ key: "plan3CtaLabel", label: "方案3按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "plan3CtaHref", label: "方案3按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "plan4Name", label: "方案4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "plan4Price", label: "方案4价格（可选）", type: "text", placeholder: "可选" },
			{ key: "plan4Feature", label: "方案4说明（可选）", type: "text", placeholder: "可选" },
			{ key: "plan4CtaLabel", label: "方案4按钮文字（可选）", type: "text", placeholder: "可选" },
			{ key: "plan4CtaHref", label: "方案4按钮链接（可选）", type: "url", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "brand-story-timeline",
		title: "品牌故事时间线",
		description: "里程碑叙事区块，支持日期、文案和配图。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 56,
		puckComponent: "BrandStoryTimelineSection",
		defaults: {
			type: "brand-story-timeline",
			heading: "我们的品牌故事",
			subtitle: "从起步到规模化，一路持续迭代。",
			milestone1Date: "2021",
			milestone1Title: "项目启动",
			milestone1Body: "完成第一版产品原型并上线首个客户。",
			milestone1ImageUrl: "",
			milestone2Date: "2023",
			milestone2Title: "多租户升级",
			milestone2Body: "实现多租户与渠道化能力，支持快速扩展。",
			milestone2ImageUrl: "",
			milestone3Date: "2025",
			milestone3Title: "运营体系完善",
			milestone3Body: "监控、告警、回滚与发布流程全面标准化。",
			milestone3ImageUrl: "",
			milestone4Date: "",
			milestone4Title: "",
			milestone4Body: "",
			milestone4ImageUrl: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：我们的品牌故事" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：从起步到规模化，一路持续迭代。",
			},
			{ key: "milestone1Date", label: "里程碑1日期", type: "text", placeholder: "例如：2021" },
			{ key: "milestone1Title", label: "里程碑1标题", type: "text", placeholder: "例如：项目启动" },
			{ key: "milestone1Body", label: "里程碑1描述", type: "textarea", placeholder: "请输入描述..." },
			{
				key: "milestone1ImageUrl",
				label: "里程碑1配图",
				type: "imageUpload",
				placeholder: "点击上传，或粘贴图片 URL",
			},
			{ key: "milestone2Date", label: "里程碑2日期（可选）", type: "text", placeholder: "可选" },
			{ key: "milestone2Title", label: "里程碑2标题（可选）", type: "text", placeholder: "可选" },
			{ key: "milestone2Body", label: "里程碑2描述（可选）", type: "textarea", placeholder: "可选" },
			{ key: "milestone2ImageUrl", label: "里程碑2配图（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "milestone3Date", label: "里程碑3日期（可选）", type: "text", placeholder: "可选" },
			{ key: "milestone3Title", label: "里程碑3标题（可选）", type: "text", placeholder: "可选" },
			{ key: "milestone3Body", label: "里程碑3描述（可选）", type: "textarea", placeholder: "可选" },
			{ key: "milestone3ImageUrl", label: "里程碑3配图（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "milestone4Date", label: "里程碑4日期（可选）", type: "text", placeholder: "可选" },
			{ key: "milestone4Title", label: "里程碑4标题（可选）", type: "text", placeholder: "可选" },
			{ key: "milestone4Body", label: "里程碑4描述（可选）", type: "textarea", placeholder: "可选" },
			{ key: "milestone4ImageUrl", label: "里程碑4配图（可选）", type: "imageUpload", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "social-links-bar",
		title: "社媒联系栏",
		description: "渠道化社交/联系链接条，适合页脚上方引导。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 57,
		puckComponent: "SocialLinksBarSection",
		defaults: {
			type: "social-links-bar",
			heading: "关注我们",
			subtitle: "获取最新活动与服务支持。",
			columns: 3,
			link1Label: "WhatsApp",
			link1Href: "https://wa.me/10000000000",
			link1Icon: "💬",
			link2Label: "Email",
			link2Href: "mailto:support@example.com",
			link2Icon: "✉️",
			link3Label: "WeChat",
			link3Href: "/default-channel/pages/contact",
			link3Icon: "🟢",
			link4Label: "",
			link4Href: "",
			link4Icon: "",
			link5Label: "",
			link5Href: "",
			link5Icon: "",
			link6Label: "",
			link6Href: "",
			link6Icon: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "sm", bottom: "sm" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：关注我们" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：获取最新活动与服务支持。" },
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "link1Label", label: "链接1名称", type: "text", placeholder: "例如：WhatsApp" },
			{ key: "link1Href", label: "链接1地址", type: "url", placeholder: "https://..." },
			{ key: "link1Icon", label: "链接1图标", type: "text", placeholder: "例如：💬" },
			{ key: "link2Label", label: "链接2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "link2Href", label: "链接2地址（可选）", type: "url", placeholder: "可选" },
			{ key: "link2Icon", label: "链接2图标（可选）", type: "text", placeholder: "可选" },
			{ key: "link3Label", label: "链接3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "link3Href", label: "链接3地址（可选）", type: "url", placeholder: "可选" },
			{ key: "link3Icon", label: "链接3图标（可选）", type: "text", placeholder: "可选" },
			{ key: "link4Label", label: "链接4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "link4Href", label: "链接4地址（可选）", type: "url", placeholder: "可选" },
			{ key: "link4Icon", label: "链接4图标（可选）", type: "text", placeholder: "可选" },
			{ key: "link5Label", label: "链接5名称（可选）", type: "text", placeholder: "可选" },
			{ key: "link5Href", label: "链接5地址（可选）", type: "url", placeholder: "可选" },
			{ key: "link5Icon", label: "链接5图标（可选）", type: "text", placeholder: "可选" },
			{ key: "link6Label", label: "链接6名称（可选）", type: "text", placeholder: "可选" },
			{ key: "link6Href", label: "链接6地址（可选）", type: "url", placeholder: "可选" },
			{ key: "link6Icon", label: "链接6图标（可选）", type: "text", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "feature-table-lite",
		title: "特性对照表（轻量）",
		description: "紧凑行列对照，适合 B2B 方案比较。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 58,
		puckComponent: "FeatureTableLiteSection",
		defaults: {
			type: "feature-table-lite",
			heading: "核心能力对比",
			subtitle: "快速了解方案差异。",
			col1Name: "入门版",
			col2Name: "成长版",
			col3Name: "企业版",
			col4Name: "",
			row1Label: "多渠道",
			row1Col1: "✓",
			row1Col2: "✓",
			row1Col3: "✓",
			row1Col4: "",
			row2Label: "自动化",
			row2Col1: "-",
			row2Col2: "✓",
			row2Col3: "✓",
			row2Col4: "",
			row3Label: "专属支持",
			row3Col1: "-",
			row3Col2: "-",
			row3Col3: "✓",
			row3Col4: "",
			row4Label: "API 扩展",
			row4Col1: "基础",
			row4Col2: "标准",
			row4Col3: "高级",
			row4Col4: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：核心能力对比" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：快速了解方案差异。" },
			{ key: "col1Name", label: "列1名称", type: "text", placeholder: "例如：入门版" },
			{ key: "col2Name", label: "列2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "col3Name", label: "列3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "col4Name", label: "列4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "row1Label", label: "行1名称", type: "text", placeholder: "例如：多渠道" },
			{ key: "row1Col1", label: "行1列1", type: "text", placeholder: "例如：✓" },
			{ key: "row1Col2", label: "行1列2（可选）", type: "text", placeholder: "可选" },
			{ key: "row1Col3", label: "行1列3（可选）", type: "text", placeholder: "可选" },
			{ key: "row1Col4", label: "行1列4（可选）", type: "text", placeholder: "可选" },
			{ key: "row2Label", label: "行2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "row2Col1", label: "行2列1（可选）", type: "text", placeholder: "可选" },
			{ key: "row2Col2", label: "行2列2（可选）", type: "text", placeholder: "可选" },
			{ key: "row2Col3", label: "行2列3（可选）", type: "text", placeholder: "可选" },
			{ key: "row2Col4", label: "行2列4（可选）", type: "text", placeholder: "可选" },
			{ key: "row3Label", label: "行3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "row3Col1", label: "行3列1（可选）", type: "text", placeholder: "可选" },
			{ key: "row3Col2", label: "行3列2（可选）", type: "text", placeholder: "可选" },
			{ key: "row3Col3", label: "行3列3（可选）", type: "text", placeholder: "可选" },
			{ key: "row3Col4", label: "行3列4（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Label", label: "行4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Col1", label: "行4列1（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Col2", label: "行4列2（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Col3", label: "行4列3（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Col4", label: "行4列4（可选）", type: "text", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "team-intro-cards",
		title: "团队介绍卡片",
		description: "创始人/核心团队卡片，支持头像与简介。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 59,
		puckComponent: "TeamIntroCardsSection",
		defaults: {
			type: "team-intro-cards",
			heading: "认识我们的团队",
			subtitle: "专注跨境与数字化增长。",
			columns: 3,
			member1Name: "Ethan Huang",
			member1Role: "Founder",
			member1Bio: "负责产品与平台架构。",
			member1ImageUrl: "",
			member1ProfileHref: "",
			member2Name: "运营负责人",
			member2Role: "Operations",
			member2Bio: "负责商家成功与运营效率。",
			member2ImageUrl: "",
			member2ProfileHref: "",
			member3Name: "技术负责人",
			member3Role: "Engineering",
			member3Bio: "负责系统稳定性与交付质量。",
			member3ImageUrl: "",
			member3ProfileHref: "",
			member4Name: "",
			member4Role: "",
			member4Bio: "",
			member4ImageUrl: "",
			member4ProfileHref: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：认识我们的团队" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：专注跨境与数字化增长。" },
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "member1Name", label: "成员1姓名", type: "text", placeholder: "例如：Ethan Huang" },
			{ key: "member1Role", label: "成员1职位", type: "text", placeholder: "例如：Founder" },
			{ key: "member1Bio", label: "成员1简介", type: "textarea", placeholder: "请输入简介..." },
			{
				key: "member1ImageUrl",
				label: "成员1头像",
				type: "imageUpload",
				placeholder: "点击上传，或粘贴图片 URL",
			},
			{ key: "member1ProfileHref", label: "成员1链接（可选）", type: "url", placeholder: "可选" },
			{ key: "member2Name", label: "成员2姓名（可选）", type: "text", placeholder: "可选" },
			{ key: "member2Role", label: "成员2职位（可选）", type: "text", placeholder: "可选" },
			{ key: "member2Bio", label: "成员2简介（可选）", type: "textarea", placeholder: "可选" },
			{ key: "member2ImageUrl", label: "成员2头像（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "member2ProfileHref", label: "成员2链接（可选）", type: "url", placeholder: "可选" },
			{ key: "member3Name", label: "成员3姓名（可选）", type: "text", placeholder: "可选" },
			{ key: "member3Role", label: "成员3职位（可选）", type: "text", placeholder: "可选" },
			{ key: "member3Bio", label: "成员3简介（可选）", type: "textarea", placeholder: "可选" },
			{ key: "member3ImageUrl", label: "成员3头像（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "member3ProfileHref", label: "成员3链接（可选）", type: "url", placeholder: "可选" },
			{ key: "member4Name", label: "成员4姓名（可选）", type: "text", placeholder: "可选" },
			{ key: "member4Role", label: "成员4职位（可选）", type: "text", placeholder: "可选" },
			{ key: "member4Bio", label: "成员4简介（可选）", type: "textarea", placeholder: "可选" },
			{ key: "member4ImageUrl", label: "成员4头像（可选）", type: "imageUpload", placeholder: "可选" },
			{ key: "member4ProfileHref", label: "成员4链接（可选）", type: "url", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "logo-with-cta-strip",
		title: "品牌+CTA 条",
		description: "品牌标识与快捷操作 CTA 的紧凑条带。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 60,
		puckComponent: "LogoWithCtaStripSection",
		defaults: {
			type: "logo-with-cta-strip",
			heading: "开启你的跨境增长",
			subtitle: "统一品牌形象并快速引导关键转化入口。",
			logoText: "FengQi",
			logoImageUrl: "",
			ctaLabel: "立即咨询",
			ctaHref: "/default-channel/pages/contact",
			secondaryCtaLabel: "查看产品",
			secondaryCtaHref: "/products",
			style: {
				background: { mode: "token", token: "muted" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "sm", bottom: "sm" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：开启你的跨境增长" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：统一品牌形象并快速引导关键转化入口。",
			},
			{ key: "logoText", label: "品牌文案（可选）", type: "text", placeholder: "例如：FengQi" },
			{
				key: "logoImageUrl",
				label: "品牌图片（可选）",
				type: "imageUpload",
				placeholder: "点击上传，或粘贴图片 URL",
			},
			{ key: "ctaLabel", label: "主按钮文案", type: "text", placeholder: "例如：立即咨询" },
			{ key: "ctaHref", label: "主按钮链接", type: "url", placeholder: "/default-channel/pages/contact" },
			{ key: "secondaryCtaLabel", label: "次按钮文案（可选）", type: "text", placeholder: "可选" },
			{ key: "secondaryCtaHref", label: "次按钮链接（可选）", type: "url", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "testimonial-marquee-lite",
		title: "评价走马灯（轻量）",
		description: "紧凑滚动口碑条，突出真实客户反馈。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 61,
		puckComponent: "TestimonialMarqueeLiteSection",
		defaults: {
			type: "testimonial-marquee-lite",
			heading: "客户怎么说",
			subtitle: "精选真实反馈，持续优化交付体验。",
			speed: "normal",
			pauseOnHover: "on",
			item1Quote: "上线速度非常快，团队响应及时。",
			item1Author: "深圳商家 A",
			item2Quote: "多租户能力稳定，运营效率提升明显。",
			item2Author: "宁波商家 B",
			item3Quote: "可视化编辑很直观，非技术也能快速上手。",
			item3Author: "杭州商家 C",
			item4Quote: "",
			item4Author: "",
			item5Quote: "",
			item5Author: "",
			item6Quote: "",
			item6Author: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "sm", bottom: "sm" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：客户怎么说" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：精选真实反馈，持续优化交付体验。",
			},
			{
				key: "speed",
				label: "滚动速度",
				type: "select",
				options: [
					{ label: "慢", value: "slow" },
					{ label: "中", value: "normal" },
					{ label: "快", value: "fast" },
				],
			},
			{
				key: "pauseOnHover",
				label: "悬停暂停",
				type: "select",
				options: [
					{ label: "开启", value: "on" },
					{ label: "关闭", value: "off" },
				],
			},
			{ key: "item1Quote", label: "评价1内容", type: "text", placeholder: "请输入评价..." },
			{ key: "item1Author", label: "评价1来源", type: "text", placeholder: "例如：深圳商家 A" },
			{ key: "item2Quote", label: "评价2内容（可选）", type: "text", placeholder: "可选" },
			{ key: "item2Author", label: "评价2来源（可选）", type: "text", placeholder: "可选" },
			{ key: "item3Quote", label: "评价3内容（可选）", type: "text", placeholder: "可选" },
			{ key: "item3Author", label: "评价3来源（可选）", type: "text", placeholder: "可选" },
			{ key: "item4Quote", label: "评价4内容（可选）", type: "text", placeholder: "可选" },
			{ key: "item4Author", label: "评价4来源（可选）", type: "text", placeholder: "可选" },
			{ key: "item5Quote", label: "评价5内容（可选）", type: "text", placeholder: "可选" },
			{ key: "item5Author", label: "评价5来源（可选）", type: "text", placeholder: "可选" },
			{ key: "item6Quote", label: "评价6内容（可选）", type: "text", placeholder: "可选" },
			{ key: "item6Author", label: "评价6来源（可选）", type: "text", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "feature-icon-table",
		title: "图标特性矩阵",
		description: "带图标的能力对照矩阵，强化可读性。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 62,
		puckComponent: "FeatureIconTableSection",
		defaults: {
			type: "feature-icon-table",
			heading: "能力矩阵",
			subtitle: "快速比较不同方案能力覆盖范围。",
			col1Name: "基础版",
			col2Name: "成长版",
			col3Name: "企业版",
			col4Name: "",
			row1Icon: "📦",
			row1Label: "订单管理",
			row1Col1: "✓",
			row1Col2: "✓",
			row1Col3: "✓",
			row1Col4: "",
			row2Icon: "🧩",
			row2Label: "插件扩展",
			row2Col1: "-",
			row2Col2: "✓",
			row2Col3: "✓",
			row2Col4: "",
			row3Icon: "🔐",
			row3Label: "权限治理",
			row3Col1: "基础",
			row3Col2: "标准",
			row3Col3: "高级",
			row3Col4: "",
			row4Icon: "📊",
			row4Label: "监控告警",
			row4Col1: "-",
			row4Col2: "基础",
			row4Col3: "增强",
			row4Col4: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：能力矩阵" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：快速比较不同方案能力覆盖范围。",
			},
			{ key: "col1Name", label: "列1名称", type: "text", placeholder: "例如：基础版" },
			{ key: "col2Name", label: "列2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "col3Name", label: "列3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "col4Name", label: "列4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "row1Icon", label: "行1图标", type: "text", placeholder: "例如：📦" },
			{ key: "row1Label", label: "行1名称", type: "text", placeholder: "例如：订单管理" },
			{ key: "row1Col1", label: "行1列1", type: "text", placeholder: "例如：✓" },
			{ key: "row1Col2", label: "行1列2（可选）", type: "text", placeholder: "可选" },
			{ key: "row1Col3", label: "行1列3（可选）", type: "text", placeholder: "可选" },
			{ key: "row1Col4", label: "行1列4（可选）", type: "text", placeholder: "可选" },
			{ key: "row2Icon", label: "行2图标（可选）", type: "text", placeholder: "可选" },
			{ key: "row2Label", label: "行2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "row2Col1", label: "行2列1（可选）", type: "text", placeholder: "可选" },
			{ key: "row2Col2", label: "行2列2（可选）", type: "text", placeholder: "可选" },
			{ key: "row2Col3", label: "行2列3（可选）", type: "text", placeholder: "可选" },
			{ key: "row2Col4", label: "行2列4（可选）", type: "text", placeholder: "可选" },
			{ key: "row3Icon", label: "行3图标（可选）", type: "text", placeholder: "可选" },
			{ key: "row3Label", label: "行3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "row3Col1", label: "行3列1（可选）", type: "text", placeholder: "可选" },
			{ key: "row3Col2", label: "行3列2（可选）", type: "text", placeholder: "可选" },
			{ key: "row3Col3", label: "行3列3（可选）", type: "text", placeholder: "可选" },
			{ key: "row3Col4", label: "行3列4（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Icon", label: "行4图标（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Label", label: "行4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Col1", label: "行4列1（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Col2", label: "行4列2（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Col3", label: "行4列3（可选）", type: "text", placeholder: "可选" },
			{ key: "row4Col4", label: "行4列4（可选）", type: "text", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "faq-two-column",
		title: "双栏 FAQ",
		description: "左侧常见问题 + 右侧帮助 CTA 的双栏布局。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 63,
		puckComponent: "FaqTwoColumnSection",
		defaults: {
			type: "faq-two-column",
			heading: "常见问题",
			subtitle: "整理租户最常问的问题，减少咨询成本。",
			q1Question: "多久可以上线店铺？",
			q1Answer: "通常 1-3 个工作日可完成基础配置并发布。",
			q2Question: "可以自定义页面风格吗？",
			q2Answer: "可以，通过主题与可视化区块进行调整。",
			q3Question: "支持多语言与多币种吗？",
			q3Answer: "支持，建议按渠道逐步配置语言与价格策略。",
			q4Question: "",
			q4Answer: "",
			helpTitle: "还没找到答案？",
			helpBody: "联系我们的顾问团队，获得一对一配置建议。",
			helpCtaLabel: "联系顾问",
			helpCtaHref: "/default-channel/pages/contact",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：常见问题" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：整理租户最常问的问题，减少咨询成本。",
			},
			{ key: "q1Question", label: "问题1", type: "text", placeholder: "请输入问题..." },
			{ key: "q1Answer", label: "答案1", type: "textarea", placeholder: "请输入答案..." },
			{ key: "q2Question", label: "问题2（可选）", type: "text", placeholder: "可选" },
			{ key: "q2Answer", label: "答案2（可选）", type: "textarea", placeholder: "可选" },
			{ key: "q3Question", label: "问题3（可选）", type: "text", placeholder: "可选" },
			{ key: "q3Answer", label: "答案3（可选）", type: "textarea", placeholder: "可选" },
			{ key: "q4Question", label: "问题4（可选）", type: "text", placeholder: "可选" },
			{ key: "q4Answer", label: "答案4（可选）", type: "textarea", placeholder: "可选" },
			{ key: "helpTitle", label: "右侧帮助标题（可选）", type: "text", placeholder: "例如：还没找到答案？" },
			{ key: "helpBody", label: "右侧帮助说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "helpCtaLabel", label: "右侧按钮文案（可选）", type: "text", placeholder: "例如：联系顾问" },
			{
				key: "helpCtaHref",
				label: "右侧按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/contact",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "product-bundle-lite",
		title: "套餐推荐（轻量）",
		description: "展示组合商品清单、套餐价与主 CTA。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 64,
		puckComponent: "ProductBundleLiteSection",
		defaults: {
			type: "product-bundle-lite",
			heading: "推荐套餐",
			subtitle: "为新客准备的一站式起步组合。",
			bundleName: "Starter Bundle",
			bundleItems: "基础模板\n运费策略配置\n店铺上线检查",
			bundlePrice: "¥ 1999",
			bundleCompareAt: "¥ 2599",
			ctaLabel: "立即购买",
			ctaHref: "/products",
			note: "支持按租户业务场景定制套餐内容。",
			style: {
				background: { mode: "token", token: "muted" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "lg", shadow: "md" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：推荐套餐" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：为新客准备的一站式起步组合。",
			},
			{ key: "bundleName", label: "套餐名称", type: "text", placeholder: "例如：Starter Bundle" },
			{
				key: "bundleItems",
				label: "套餐项目（每行一项）",
				type: "textarea",
				placeholder: "基础模板\\n运费策略配置\\n店铺上线检查",
			},
			{ key: "bundlePrice", label: "套餐价", type: "text", placeholder: "例如：¥ 1999" },
			{ key: "bundleCompareAt", label: "划线价（可选）", type: "text", placeholder: "例如：¥ 2599" },
			{ key: "ctaLabel", label: "按钮文案", type: "text", placeholder: "例如：立即购买" },
			{ key: "ctaHref", label: "按钮链接", type: "url", placeholder: "/products" },
			{ key: "note", label: "补充说明（可选）", type: "textarea", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "announcement-stack",
		title: "公告堆叠卡片",
		description: "多条公告信息按严重级别展示，适合活动/维护通知。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 65,
		puckComponent: "AnnouncementStackSection",
		defaults: {
			type: "announcement-stack",
			heading: "重要通知",
			subtitle: "请关注最新活动与系统安排。",
			item1Level: "warning",
			item1Title: "春节期间客服响应延迟",
			item1Body: "节假日期间响应时间可能延长至 24 小时内。",
			item2Level: "info",
			item2Title: "新主题功能已上线",
			item2Body: "可在可视化编辑器中启用更多首页区块。",
			item3Level: "success",
			item3Title: "",
			item3Body: "",
			item4Level: "error",
			item4Title: "",
			item4Body: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "sm", bottom: "sm" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：重要通知" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：请关注最新活动与系统安排。" },
			{
				key: "item1Level",
				label: "公告1级别",
				type: "select",
				options: [
					{ label: "信息", value: "info" },
					{ label: "成功", value: "success" },
					{ label: "警告", value: "warning" },
					{ label: "错误", value: "error" },
				],
			},
			{ key: "item1Title", label: "公告1标题", type: "text", placeholder: "请输入标题..." },
			{ key: "item1Body", label: "公告1内容", type: "textarea", placeholder: "请输入公告内容..." },
			{
				key: "item2Level",
				label: "公告2级别（可选）",
				type: "select",
				options: [
					{ label: "信息", value: "info" },
					{ label: "成功", value: "success" },
					{ label: "警告", value: "warning" },
					{ label: "错误", value: "error" },
				],
			},
			{ key: "item2Title", label: "公告2标题（可选）", type: "text", placeholder: "可选" },
			{ key: "item2Body", label: "公告2内容（可选）", type: "textarea", placeholder: "可选" },
			{
				key: "item3Level",
				label: "公告3级别（可选）",
				type: "select",
				options: [
					{ label: "信息", value: "info" },
					{ label: "成功", value: "success" },
					{ label: "警告", value: "warning" },
					{ label: "错误", value: "error" },
				],
			},
			{ key: "item3Title", label: "公告3标题（可选）", type: "text", placeholder: "可选" },
			{ key: "item3Body", label: "公告3内容（可选）", type: "textarea", placeholder: "可选" },
			{
				key: "item4Level",
				label: "公告4级别（可选）",
				type: "select",
				options: [
					{ label: "信息", value: "info" },
					{ label: "成功", value: "success" },
					{ label: "警告", value: "warning" },
					{ label: "错误", value: "error" },
				],
			},
			{ key: "item4Title", label: "公告4标题（可选）", type: "text", placeholder: "可选" },
			{ key: "item4Body", label: "公告4内容（可选）", type: "textarea", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "product-feature-tabs",
		title: "商品特性标签",
		description: "用标签页展示卖点、规格与服务说明。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 66,
		puckComponent: "ProductFeatureTabsSection",
		defaults: {
			type: "product-feature-tabs",
			heading: "核心卖点",
			subtitle: "把购买前最关心的信息集中展示。",
			tab1Title: "产品亮点",
			tab1Body: "适合跨境商家快速上线，支持多渠道统一管理。",
			tab2Title: "规格参数",
			tab2Body: "支持按类目配置属性，便于标准化运营。",
			tab3Title: "交付与服务",
			tab3Body: "提供上线协助与持续优化建议。",
			tab4Title: "",
			tab4Body: "",
			ctaLabel: "查看更多商品",
			ctaHref: "/products",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：核心卖点" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：把购买前最关心的信息集中展示。",
			},
			{ key: "tab1Title", label: "标签1标题", type: "text", placeholder: "例如：产品亮点" },
			{ key: "tab1Body", label: "标签1内容", type: "textarea", placeholder: "请输入内容..." },
			{ key: "tab2Title", label: "标签2标题（可选）", type: "text", placeholder: "可选" },
			{ key: "tab2Body", label: "标签2内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "tab3Title", label: "标签3标题（可选）", type: "text", placeholder: "可选" },
			{ key: "tab3Body", label: "标签3内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "tab4Title", label: "标签4标题（可选）", type: "text", placeholder: "可选" },
			{ key: "tab4Body", label: "标签4内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "ctaLabel", label: "按钮文案（可选）", type: "text", placeholder: "例如：查看更多商品" },
			{ key: "ctaHref", label: "按钮链接（可选）", type: "url", placeholder: "/products" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "benefit-cards-grid",
		title: "利益点卡片网格",
		description: "用图标卡片展示优势，每张卡片可配置独立 CTA。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 67,
		puckComponent: "BenefitCardsGridSection",
		defaults: {
			type: "benefit-cards-grid",
			heading: "为什么选择我们",
			subtitle: "通过结构化卡片快速传达核心价值。",
			columns: 3,
			card1Icon: "⚡",
			card1Title: "快速上线",
			card1Body: "模板化流程，降低启动成本。",
			card1CtaLabel: "了解流程",
			card1CtaHref: "/default-channel/pages/support",
			card2Icon: "🛡️",
			card2Title: "稳定可靠",
			card2Body: "多租户隔离与监控体系持续保障。",
			card2CtaLabel: "查看保障",
			card2CtaHref: "/default-channel/pages/shipping",
			card3Icon: "📈",
			card3Title: "持续增长",
			card3Body: "支持按阶段优化页面和转化策略。",
			card3CtaLabel: "查看案例",
			card3CtaHref: "/products",
			card4Icon: "",
			card4Title: "",
			card4Body: "",
			card4CtaLabel: "",
			card4CtaHref: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：为什么选择我们" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：通过结构化卡片快速传达核心价值。",
			},
			{
				key: "columns",
				label: "列数",
				type: "select",
				options: [
					{ label: "2 列", value: "2" },
					{ label: "3 列", value: "3" },
					{ label: "4 列", value: "4" },
				],
			},
			{ key: "card1Icon", label: "卡片1图标", type: "text", placeholder: "例如：⚡" },
			{ key: "card1Title", label: "卡片1标题", type: "text", placeholder: "请输入标题..." },
			{ key: "card1Body", label: "卡片1内容", type: "textarea", placeholder: "请输入内容..." },
			{ key: "card1CtaLabel", label: "卡片1按钮文案（可选）", type: "text", placeholder: "可选" },
			{ key: "card1CtaHref", label: "卡片1按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "card2Icon", label: "卡片2图标（可选）", type: "text", placeholder: "可选" },
			{ key: "card2Title", label: "卡片2标题（可选）", type: "text", placeholder: "可选" },
			{ key: "card2Body", label: "卡片2内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "card2CtaLabel", label: "卡片2按钮文案（可选）", type: "text", placeholder: "可选" },
			{ key: "card2CtaHref", label: "卡片2按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "card3Icon", label: "卡片3图标（可选）", type: "text", placeholder: "可选" },
			{ key: "card3Title", label: "卡片3标题（可选）", type: "text", placeholder: "可选" },
			{ key: "card3Body", label: "卡片3内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "card3CtaLabel", label: "卡片3按钮文案（可选）", type: "text", placeholder: "可选" },
			{ key: "card3CtaHref", label: "卡片3按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "card4Icon", label: "卡片4图标（可选）", type: "text", placeholder: "可选" },
			{ key: "card4Title", label: "卡片4标题（可选）", type: "text", placeholder: "可选" },
			{ key: "card4Body", label: "卡片4内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "card4CtaLabel", label: "卡片4按钮文案（可选）", type: "text", placeholder: "可选" },
			{ key: "card4CtaHref", label: "卡片4按钮链接（可选）", type: "url", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "shipping-returns-panel",
		title: "物流退换说明面板",
		description: "集中展示发货、退换、支付与支持信息。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 68,
		puckComponent: "ShippingReturnsPanelSection",
		defaults: {
			type: "shipping-returns-panel",
			heading: "物流与售后说明",
			subtitle: "下单前关键政策一目了然。",
			shippingTitle: "发货时效",
			shippingBody: "常规订单 1-3 个工作日内发出。",
			returnsTitle: "退换政策",
			returnsBody: "支持 7 天内按规则申请退换。",
			paymentTitle: "支付方式",
			paymentBody: "支持信用卡与常见本地支付方式。",
			supportTitle: "售后支持",
			supportBody: "客服工作日在线，问题可快速响应。",
			primaryCtaLabel: "查看完整政策",
			primaryCtaHref: "/default-channel/pages/shipping",
			secondaryCtaLabel: "联系支持",
			secondaryCtaHref: "/default-channel/pages/support",
			style: {
				background: { mode: "token", token: "muted" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：物流与售后说明" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：下单前关键政策一目了然。" },
			{ key: "shippingTitle", label: "发货标题", type: "text", placeholder: "例如：发货时效" },
			{ key: "shippingBody", label: "发货说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "returnsTitle", label: "退换标题", type: "text", placeholder: "例如：退换政策" },
			{ key: "returnsBody", label: "退换说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "paymentTitle", label: "支付标题（可选）", type: "text", placeholder: "可选" },
			{ key: "paymentBody", label: "支付说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "supportTitle", label: "支持标题（可选）", type: "text", placeholder: "可选" },
			{ key: "supportBody", label: "支持说明（可选）", type: "textarea", placeholder: "可选" },
			{
				key: "primaryCtaLabel",
				label: "主按钮文案（可选）",
				type: "text",
				placeholder: "例如：查看完整政策",
			},
			{
				key: "primaryCtaHref",
				label: "主按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/shipping",
			},
			{ key: "secondaryCtaLabel", label: "次按钮文案（可选）", type: "text", placeholder: "例如：联系支持" },
			{
				key: "secondaryCtaHref",
				label: "次按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/support",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "support-contact-split",
		title: "支持联系分栏",
		description: "左侧支持渠道，右侧 SLA 承诺与动作入口。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 69,
		puckComponent: "SupportContactSplitSection",
		defaults: {
			type: "support-contact-split",
			heading: "需要帮助？",
			subtitle: "我们提供多渠道支持与明确响应承诺。",
			leftTitle: "联系渠道",
			leftBody: "优先通过在线渠道提交问题，便于快速定位。",
			channel1Label: "在线客服",
			channel1Value: "工作日 09:00-18:00",
			channel1Href: "/default-channel/pages/support",
			channel2Label: "邮箱支持",
			channel2Value: "support@example.com",
			channel2Href: "mailto:support@example.com",
			channel3Label: "电话支持",
			channel3Value: "+86 400-000-0000",
			channel3Href: "tel:+864000000000",
			slaTitle: "服务承诺",
			slaBody: "工作日工单 4 小时内响应，重大问题优先升级处理。",
			slaBadge: "SLA 4h",
			primaryCtaLabel: "提交工单",
			primaryCtaHref: "/default-channel/pages/support",
			secondaryCtaLabel: "查看帮助中心",
			secondaryCtaHref: "/default-channel/pages/faq",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：需要帮助？" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：我们提供多渠道支持与明确响应承诺。",
			},
			{ key: "leftTitle", label: "左侧标题", type: "text", placeholder: "例如：联系渠道" },
			{ key: "leftBody", label: "左侧说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "channel1Label", label: "渠道1名称", type: "text", placeholder: "例如：在线客服" },
			{ key: "channel1Value", label: "渠道1信息", type: "text", placeholder: "例如：工作日 09:00-18:00" },
			{ key: "channel1Href", label: "渠道1链接", type: "url", placeholder: "/default-channel/pages/support" },
			{ key: "channel2Label", label: "渠道2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "channel2Value", label: "渠道2信息（可选）", type: "text", placeholder: "可选" },
			{ key: "channel2Href", label: "渠道2链接（可选）", type: "url", placeholder: "可选" },
			{ key: "channel3Label", label: "渠道3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "channel3Value", label: "渠道3信息（可选）", type: "text", placeholder: "可选" },
			{ key: "channel3Href", label: "渠道3链接（可选）", type: "url", placeholder: "可选" },
			{ key: "slaTitle", label: "SLA 标题（可选）", type: "text", placeholder: "例如：服务承诺" },
			{ key: "slaBody", label: "SLA 说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "slaBadge", label: "SLA 徽标（可选）", type: "text", placeholder: "例如：SLA 4h" },
			{ key: "primaryCtaLabel", label: "主按钮文案（可选）", type: "text", placeholder: "例如：提交工单" },
			{
				key: "primaryCtaHref",
				label: "主按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/support",
			},
			{
				key: "secondaryCtaLabel",
				label: "次按钮文案（可选）",
				type: "text",
				placeholder: "例如：查看帮助中心",
			},
			{
				key: "secondaryCtaHref",
				label: "次按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/faq",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "faq-category-pills",
		title: "FAQ 分类胶囊",
		description: "按分类展示问答，适合非技术租户快速组织帮助内容。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 70,
		puckComponent: "FaqCategoryPillsSection",
		defaults: {
			type: "faq-category-pills",
			heading: "常见问题分类",
			subtitle: "按主题快速查看问题与答案。",
			category1Name: "下单与支付",
			category1Q1: "支持哪些支付方式？",
			category1A1: "支持信用卡及主流本地支付方式。",
			category1Q2: "可以开具发票吗？",
			category1A2: "支持，提交企业信息后可开具电子发票。",
			category2Name: "物流与配送",
			category2Q1: "多久发货？",
			category2A1: "常规订单 1-3 个工作日发出。",
			category2Q2: "是否支持海外配送？",
			category2A2: "支持，具体范围以结算页提示为准。",
			category3Name: "售后与支持",
			category3Q1: "如何申请退款？",
			category3A1: "在订单页提交申请，客服会协助处理。",
			category3Q2: "",
			category3A2: "",
			defaultCategory: "category1",
			helpCtaLabel: "联系支持",
			helpCtaHref: "/default-channel/pages/support",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：常见问题分类" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：按主题快速查看问题与答案。" },
			{ key: "category1Name", label: "分类1名称", type: "text", placeholder: "例如：下单与支付" },
			{ key: "category1Q1", label: "分类1问题1", type: "text", placeholder: "请输入问题..." },
			{ key: "category1A1", label: "分类1答案1", type: "textarea", placeholder: "请输入答案..." },
			{ key: "category1Q2", label: "分类1问题2（可选）", type: "text", placeholder: "可选" },
			{ key: "category1A2", label: "分类1答案2（可选）", type: "textarea", placeholder: "可选" },
			{ key: "category2Name", label: "分类2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "category2Q1", label: "分类2问题1（可选）", type: "text", placeholder: "可选" },
			{ key: "category2A1", label: "分类2答案1（可选）", type: "textarea", placeholder: "可选" },
			{ key: "category2Q2", label: "分类2问题2（可选）", type: "text", placeholder: "可选" },
			{ key: "category2A2", label: "分类2答案2（可选）", type: "textarea", placeholder: "可选" },
			{ key: "category3Name", label: "分类3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "category3Q1", label: "分类3问题1（可选）", type: "text", placeholder: "可选" },
			{ key: "category3A1", label: "分类3答案1（可选）", type: "textarea", placeholder: "可选" },
			{ key: "category3Q2", label: "分类3问题2（可选）", type: "text", placeholder: "可选" },
			{ key: "category3A2", label: "分类3答案2（可选）", type: "textarea", placeholder: "可选" },
			{
				key: "defaultCategory",
				label: "默认分类",
				type: "select",
				options: [
					{ label: "分类1", value: "category1" },
					{ label: "分类2", value: "category2" },
					{ label: "分类3", value: "category3" },
				],
			},
			{ key: "helpCtaLabel", label: "帮助按钮文案（可选）", type: "text", placeholder: "例如：联系支持" },
			{
				key: "helpCtaHref",
				label: "帮助按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/support",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "promo-tile-mosaic",
		title: "促销拼贴宫格",
		description: "2x2 促销卡片，支持混合 CTA 形式。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 71,
		puckComponent: "PromoTileMosaicSection",
		defaults: {
			type: "promo-tile-mosaic",
			heading: "精选活动",
			subtitle: "不同主题活动统一展示，提升点击率。",
			tile1Badge: "限时",
			tile1Title: "新客专享券",
			tile1Body: "首单立减，自动在结算时生效。",
			tile1CtaLabel: "立即领取",
			tile1CtaHref: "/products",
			tile2Badge: "热卖",
			tile2Title: "爆款组合",
			tile2Body: "高频商品组合优惠中。",
			tile2CtaLabel: "查看组合",
			tile2CtaHref: "/products",
			tile3Badge: "新品",
			tile3Title: "本周上新",
			tile3Body: "查看最新上架商品与限量配色。",
			tile3CtaLabel: "查看新品",
			tile3CtaHref: "/products?sort=date",
			tile4Badge: "",
			tile4Title: "",
			tile4Body: "",
			tile4CtaLabel: "",
			tile4CtaHref: "",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：精选活动" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：不同主题活动统一展示，提升点击率。",
			},
			{ key: "tile1Badge", label: "卡片1徽标", type: "text", placeholder: "例如：限时" },
			{ key: "tile1Title", label: "卡片1标题", type: "text", placeholder: "请输入标题..." },
			{ key: "tile1Body", label: "卡片1内容", type: "textarea", placeholder: "请输入内容..." },
			{ key: "tile1CtaLabel", label: "卡片1按钮文案（可选）", type: "text", placeholder: "可选" },
			{ key: "tile1CtaHref", label: "卡片1按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "tile2Badge", label: "卡片2徽标（可选）", type: "text", placeholder: "可选" },
			{ key: "tile2Title", label: "卡片2标题（可选）", type: "text", placeholder: "可选" },
			{ key: "tile2Body", label: "卡片2内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "tile2CtaLabel", label: "卡片2按钮文案（可选）", type: "text", placeholder: "可选" },
			{ key: "tile2CtaHref", label: "卡片2按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "tile3Badge", label: "卡片3徽标（可选）", type: "text", placeholder: "可选" },
			{ key: "tile3Title", label: "卡片3标题（可选）", type: "text", placeholder: "可选" },
			{ key: "tile3Body", label: "卡片3内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "tile3CtaLabel", label: "卡片3按钮文案（可选）", type: "text", placeholder: "可选" },
			{ key: "tile3CtaHref", label: "卡片3按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "tile4Badge", label: "卡片4徽标（可选）", type: "text", placeholder: "可选" },
			{ key: "tile4Title", label: "卡片4标题（可选）", type: "text", placeholder: "可选" },
			{ key: "tile4Body", label: "卡片4内容（可选）", type: "textarea", placeholder: "可选" },
			{ key: "tile4CtaLabel", label: "卡片4按钮文案（可选）", type: "text", placeholder: "可选" },
			{ key: "tile4CtaHref", label: "卡片4按钮链接（可选）", type: "url", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "bundle-price-breakdown",
		title: "套餐价格拆解",
		description: "展示套餐构成、总价与节省金额，降低决策门槛。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 72,
		puckComponent: "BundlePriceBreakdownSection",
		defaults: {
			type: "bundle-price-breakdown",
			heading: "套餐价格说明",
			subtitle: "清晰展示每个模块价值与最终优惠。",
			planName: "Growth Bundle",
			item1Label: "模板部署",
			item1Price: "¥ 899",
			item2Label: "运营配置",
			item2Price: "¥ 699",
			item3Label: "上线支持",
			item3Price: "¥ 499",
			totalLabel: "套餐总价",
			totalPrice: "¥ 1699",
			saveLabel: "立省",
			saveValue: "¥ 398",
			ctaLabel: "立即下单",
			ctaHref: "/products",
			note: "价格仅供参考，最终以签约方案为准。",
			style: {
				background: { mode: "token", token: "muted" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：套餐价格说明" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：清晰展示每个模块价值与最终优惠。",
			},
			{ key: "planName", label: "套餐名称", type: "text", placeholder: "例如：Growth Bundle" },
			{ key: "item1Label", label: "条目1名称", type: "text", placeholder: "例如：模板部署" },
			{ key: "item1Price", label: "条目1价格", type: "text", placeholder: "例如：¥ 899" },
			{ key: "item2Label", label: "条目2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "item2Price", label: "条目2价格（可选）", type: "text", placeholder: "可选" },
			{ key: "item3Label", label: "条目3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "item3Price", label: "条目3价格（可选）", type: "text", placeholder: "可选" },
			{ key: "totalLabel", label: "总价标签", type: "text", placeholder: "例如：套餐总价" },
			{ key: "totalPrice", label: "总价", type: "text", placeholder: "例如：¥ 1699" },
			{ key: "saveLabel", label: "节省标签（可选）", type: "text", placeholder: "例如：立省" },
			{ key: "saveValue", label: "节省金额（可选）", type: "text", placeholder: "例如：¥ 398" },
			{ key: "ctaLabel", label: "按钮文案（可选）", type: "text", placeholder: "例如：立即下单" },
			{ key: "ctaHref", label: "按钮链接（可选）", type: "url", placeholder: "/products" },
			{ key: "note", label: "补充说明（可选）", type: "textarea", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "store-hours-status",
		title: "营业时间与状态",
		description: "展示营业时段与当前状态，减少咨询沟通成本。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 73,
		puckComponent: "StoreHoursStatusSection",
		defaults: {
			type: "store-hours-status",
			heading: "营业时间",
			subtitle: "请在营业时段联系，我们会更快响应。",
			timezoneLabel: "Asia/Shanghai",
			statusMode: "open",
			statusText: "当前在线",
			weekdayHours: "周一至周五 09:00 - 18:00",
			weekendHours: "周六 10:00 - 16:00",
			holidayHours: "法定节假日以公告为准",
			noticeText: "紧急问题请通过工单提交，我们会优先处理。",
			primaryCtaLabel: "提交工单",
			primaryCtaHref: "/default-channel/pages/support",
			secondaryCtaLabel: "查看帮助中心",
			secondaryCtaHref: "/default-channel/pages/faq",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：营业时间" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：请在营业时段联系，我们会更快响应。",
			},
			{ key: "timezoneLabel", label: "时区标识", type: "text", placeholder: "例如：Asia/Shanghai" },
			{
				key: "statusMode",
				label: "状态模式",
				type: "select",
				options: [
					{ label: "营业中", value: "open" },
					{ label: "已打烊", value: "closed" },
					{ label: "公告提示", value: "notice" },
				],
			},
			{ key: "statusText", label: "状态文案", type: "text", placeholder: "例如：当前在线" },
			{
				key: "weekdayHours",
				label: "工作日时间",
				type: "text",
				placeholder: "例如：周一至周五 09:00 - 18:00",
			},
			{ key: "weekendHours", label: "周末时间（可选）", type: "text", placeholder: "可选" },
			{ key: "holidayHours", label: "节假日说明（可选）", type: "text", placeholder: "可选" },
			{ key: "noticeText", label: "补充提示（可选）", type: "textarea", placeholder: "可选" },
			{ key: "primaryCtaLabel", label: "主按钮文案（可选）", type: "text", placeholder: "例如：提交工单" },
			{
				key: "primaryCtaHref",
				label: "主按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/support",
			},
			{
				key: "secondaryCtaLabel",
				label: "次按钮文案（可选）",
				type: "text",
				placeholder: "例如：查看帮助中心",
			},
			{
				key: "secondaryCtaHref",
				label: "次按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/faq",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "trust-faq-strip",
		title: "信任 + FAQ 条",
		description: "紧凑展示信任点与短 FAQ，适合页面中段快速说明。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 74,
		puckComponent: "TrustFaqStripSection",
		defaults: {
			type: "trust-faq-strip",
			heading: "下单前你可能关心",
			subtitle: "我们把常见疑问与保障放在一起。",
			trust1Icon: "🔐",
			trust1Label: "支付安全",
			trust2Icon: "🚚",
			trust2Label: "物流可追踪",
			trust3Icon: "🛠️",
			trust3Label: "售后支持",
			faq1Q: "多久发货？",
			faq1A: "通常 1-3 个工作日发出。",
			faq2Q: "支持退款吗？",
			faq2A: "符合规则可申请退款。",
			faq3Q: "",
			faq3A: "",
			ctaLabel: "查看更多 FAQ",
			ctaHref: "/default-channel/pages/faq",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "sm", bottom: "sm" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：下单前你可能关心" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：我们把常见疑问与保障放在一起。",
			},
			{ key: "trust1Icon", label: "信任点1图标", type: "text", placeholder: "例如：🔐" },
			{ key: "trust1Label", label: "信任点1文案", type: "text", placeholder: "例如：支付安全" },
			{ key: "trust2Icon", label: "信任点2图标（可选）", type: "text", placeholder: "可选" },
			{ key: "trust2Label", label: "信任点2文案（可选）", type: "text", placeholder: "可选" },
			{ key: "trust3Icon", label: "信任点3图标（可选）", type: "text", placeholder: "可选" },
			{ key: "trust3Label", label: "信任点3文案（可选）", type: "text", placeholder: "可选" },
			{ key: "faq1Q", label: "FAQ1问题", type: "text", placeholder: "请输入问题..." },
			{ key: "faq1A", label: "FAQ1回答", type: "textarea", placeholder: "请输入回答..." },
			{ key: "faq2Q", label: "FAQ2问题（可选）", type: "text", placeholder: "可选" },
			{ key: "faq2A", label: "FAQ2回答（可选）", type: "textarea", placeholder: "可选" },
			{ key: "faq3Q", label: "FAQ3问题（可选）", type: "text", placeholder: "可选" },
			{ key: "faq3A", label: "FAQ3回答（可选）", type: "textarea", placeholder: "可选" },
			{ key: "ctaLabel", label: "按钮文案（可选）", type: "text", placeholder: "例如：查看更多 FAQ" },
			{ key: "ctaHref", label: "按钮链接（可选）", type: "url", placeholder: "/default-channel/pages/faq" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "usp-metrics-split",
		title: "卖点 + 指标分栏",
		description: "左侧展示核心卖点，右侧展示关键业务指标。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 75,
		puckComponent: "UspMetricsSplitSection",
		defaults: {
			type: "usp-metrics-split",
			heading: "为什么选择我们",
			subtitle: "用清晰卖点和关键指标增强决策信心。",
			usp1Title: "快速上线",
			usp1Body: "标准化流程，缩短交付周期。",
			usp2Title: "多租户隔离",
			usp2Body: "配置和数据按租户独立管理。",
			usp3Title: "持续优化",
			usp3Body: "按监控数据持续迭代体验。",
			metric1Label: "平均交付周期",
			metric1Value: "14 天",
			metric1Note: "含部署与初始化",
			metric2Label: "可用性目标",
			metric2Value: "99.9%",
			metric2Note: "按月统计",
			metric3Label: "工单首响",
			metric3Value: "< 30 分钟",
			metric3Note: "工作时段内",
			ctaLabel: "查看服务详情",
			ctaHref: "/default-channel/pages/services",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：为什么选择我们" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：用清晰卖点和关键指标增强决策信心。",
			},
			{ key: "usp1Title", label: "卖点1标题", type: "text", placeholder: "例如：快速上线" },
			{ key: "usp1Body", label: "卖点1说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "usp2Title", label: "卖点2标题（可选）", type: "text", placeholder: "可选" },
			{ key: "usp2Body", label: "卖点2说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "usp3Title", label: "卖点3标题（可选）", type: "text", placeholder: "可选" },
			{ key: "usp3Body", label: "卖点3说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "metric1Label", label: "指标1名称", type: "text", placeholder: "例如：平均交付周期" },
			{ key: "metric1Value", label: "指标1数值", type: "text", placeholder: "例如：14 天" },
			{ key: "metric1Note", label: "指标1备注（可选）", type: "text", placeholder: "可选" },
			{ key: "metric2Label", label: "指标2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "metric2Value", label: "指标2数值（可选）", type: "text", placeholder: "可选" },
			{ key: "metric2Note", label: "指标2备注（可选）", type: "text", placeholder: "可选" },
			{ key: "metric3Label", label: "指标3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "metric3Value", label: "指标3数值（可选）", type: "text", placeholder: "可选" },
			{ key: "metric3Note", label: "指标3备注（可选）", type: "text", placeholder: "可选" },
			{ key: "ctaLabel", label: "按钮文案（可选）", type: "text", placeholder: "例如：查看服务详情" },
			{
				key: "ctaHref",
				label: "按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/services",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "category-promo-rail",
		title: "分类 + 促销轨道",
		description: "左侧快速分类入口，右侧促销卡片信息。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 76,
		puckComponent: "CategoryPromoRailSection",
		defaults: {
			type: "category-promo-rail",
			heading: "快速进入重点类目",
			subtitle: "同时曝光当前活动，提高转化效率。",
			category1Name: "新品专区",
			category1Href: "/default-channel/products?sort=date",
			category2Name: "热卖推荐",
			category2Href: "/default-channel/collections/featured-products",
			category3Name: "清仓特惠",
			category3Href: "/default-channel/products?sort=price",
			promo1Badge: "限时活动",
			promo1Title: "满 2 件 9 折",
			promo1Body: "指定分类自动优惠，活动结束后恢复原价。",
			promo1CtaLabel: "立即查看",
			promo1CtaHref: "/default-channel/products",
			promo2Badge: "会员专享",
			promo2Title: "下单送物流升级",
			promo2Body: "本周内下单享受优先处理。",
			promo2CtaLabel: "查看规则",
			promo2CtaHref: "/default-channel/pages/policies",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：快速进入重点类目" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：同时曝光当前活动，提高转化效率。",
			},
			{ key: "category1Name", label: "分类1名称", type: "text", placeholder: "例如：新品专区" },
			{
				key: "category1Href",
				label: "分类1链接",
				type: "url",
				placeholder: "/default-channel/products?sort=date",
			},
			{ key: "category2Name", label: "分类2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "category2Href", label: "分类2链接（可选）", type: "url", placeholder: "可选" },
			{ key: "category3Name", label: "分类3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "category3Href", label: "分类3链接（可选）", type: "url", placeholder: "可选" },
			{ key: "promo1Badge", label: "促销1徽标（可选）", type: "text", placeholder: "例如：限时活动" },
			{ key: "promo1Title", label: "促销1标题", type: "text", placeholder: "例如：满 2 件 9 折" },
			{ key: "promo1Body", label: "促销1说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "promo1CtaLabel", label: "促销1按钮文案（可选）", type: "text", placeholder: "例如：立即查看" },
			{
				key: "promo1CtaHref",
				label: "促销1按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/products",
			},
			{ key: "promo2Badge", label: "促销2徽标（可选）", type: "text", placeholder: "可选" },
			{ key: "promo2Title", label: "促销2标题（可选）", type: "text", placeholder: "可选" },
			{ key: "promo2Body", label: "促销2说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "promo2CtaLabel", label: "促销2按钮文案（可选）", type: "text", placeholder: "可选" },
			{ key: "promo2CtaHref", label: "促销2按钮链接（可选）", type: "url", placeholder: "可选" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "helpdesk-quick-faq",
		title: "客服快捷 FAQ",
		description: "聚合常见问题和客服入口，缩短访客决策路径。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 77,
		puckComponent: "HelpdeskQuickFaqSection",
		defaults: {
			type: "helpdesk-quick-faq",
			heading: "需要帮助？",
			subtitle: "常见问题和客服入口都在这里。",
			faq1Q: "发货需要多久？",
			faq1A: "通常 1-3 个工作日内发货。",
			faq2Q: "如何申请售后？",
			faq2A: "可在订单详情提交售后申请。",
			faq3Q: "支持哪些支付方式？",
			faq3A: "支持主流银行卡与第三方支付。",
			channel1Label: "在线客服",
			channel1Value: "工作日 09:00-18:00",
			channel1Href: "/default-channel/pages/support",
			channel2Label: "服务邮箱",
			channel2Value: "support@example.com",
			channel2Href: "mailto:support@example.com",
			primaryCtaLabel: "提交工单",
			primaryCtaHref: "/default-channel/pages/support",
			secondaryCtaLabel: "查看帮助中心",
			secondaryCtaHref: "/default-channel/pages/faq",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：需要帮助？" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：常见问题和客服入口都在这里。",
			},
			{ key: "faq1Q", label: "FAQ1问题", type: "text", placeholder: "请输入问题..." },
			{ key: "faq1A", label: "FAQ1回答", type: "textarea", placeholder: "请输入回答..." },
			{ key: "faq2Q", label: "FAQ2问题（可选）", type: "text", placeholder: "可选" },
			{ key: "faq2A", label: "FAQ2回答（可选）", type: "textarea", placeholder: "可选" },
			{ key: "faq3Q", label: "FAQ3问题（可选）", type: "text", placeholder: "可选" },
			{ key: "faq3A", label: "FAQ3回答（可选）", type: "textarea", placeholder: "可选" },
			{ key: "channel1Label", label: "渠道1名称", type: "text", placeholder: "例如：在线客服" },
			{ key: "channel1Value", label: "渠道1说明", type: "text", placeholder: "例如：工作日 09:00-18:00" },
			{
				key: "channel1Href",
				label: "渠道1链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/support",
			},
			{ key: "channel2Label", label: "渠道2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "channel2Value", label: "渠道2说明（可选）", type: "text", placeholder: "可选" },
			{ key: "channel2Href", label: "渠道2链接（可选）", type: "url", placeholder: "可选" },
			{ key: "primaryCtaLabel", label: "主按钮文案（可选）", type: "text", placeholder: "例如：提交工单" },
			{
				key: "primaryCtaHref",
				label: "主按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/support",
			},
			{
				key: "secondaryCtaLabel",
				label: "次按钮文案（可选）",
				type: "text",
				placeholder: "例如：查看帮助中心",
			},
			{
				key: "secondaryCtaHref",
				label: "次按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/faq",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "sticky-announcement-queue",
		title: "公告队列条",
		description: "可轮播的顶部公告队列，适合活动与服务通知。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 81,
		puckComponent: "StickyAnnouncementQueueSection",
		defaults: {
			type: "sticky-announcement-queue",
			heading: "最新公告",
			announce1Text: "新客首单免运费（限本周）",
			announce1Level: "success",
			announce1Href: "/default-channel/products",
			announce2Text: "春节期间客服响应可能延迟",
			announce2Level: "warning",
			announce2Href: "/default-channel/pages/support",
			announce3Text: "系统维护窗口：周日 02:00-03:00",
			announce3Level: "info",
			announce3Href: "/default-channel/pages/status",
			autoRotateSeconds: 5,
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "sm", bottom: "sm" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题（可选）", type: "text", placeholder: "例如：最新公告" },
			{ key: "announce1Text", label: "公告1文案", type: "text", placeholder: "请输入公告..." },
			{
				key: "announce1Level",
				label: "公告1级别",
				type: "select",
				options: [
					{ label: "信息", value: "info" },
					{ label: "成功", value: "success" },
					{ label: "提醒", value: "warning" },
				],
			},
			{ key: "announce1Href", label: "公告1链接（可选）", type: "url", placeholder: "可选" },
			{ key: "announce2Text", label: "公告2文案（可选）", type: "text", placeholder: "可选" },
			{
				key: "announce2Level",
				label: "公告2级别",
				type: "select",
				options: [
					{ label: "信息", value: "info" },
					{ label: "成功", value: "success" },
					{ label: "提醒", value: "warning" },
				],
			},
			{ key: "announce2Href", label: "公告2链接（可选）", type: "url", placeholder: "可选" },
			{ key: "announce3Text", label: "公告3文案（可选）", type: "text", placeholder: "可选" },
			{
				key: "announce3Level",
				label: "公告3级别",
				type: "select",
				options: [
					{ label: "信息", value: "info" },
					{ label: "成功", value: "success" },
					{ label: "提醒", value: "warning" },
				],
			},
			{ key: "announce3Href", label: "公告3链接（可选）", type: "url", placeholder: "可选" },
			{ key: "autoRotateSeconds", label: "自动轮播秒数", type: "number", min: 3, max: 30, placeholder: "5" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "tiered-pricing-table",
		title: "阶梯价格表",
		description: "展示 2-3 档方案价格和能力差异。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 82,
		puckComponent: "TieredPricingTableSection",
		defaults: {
			type: "tiered-pricing-table",
			heading: "选择合适方案",
			subtitle: "按业务阶段选择最适合的服务包。",
			tier1Name: "Starter",
			tier1Price: "¥ 999 / 月",
			tier1Features: "基础主题\n商品管理\n工单支持",
			tier1CtaLabel: "选择 Starter",
			tier1CtaHref: "/default-channel/pages/pricing",
			tier2Name: "Growth",
			tier2Price: "¥ 1999 / 月",
			tier2Features: "高级组件\n自动化运营\n优先支持",
			tier2CtaLabel: "选择 Growth",
			tier2CtaHref: "/default-channel/pages/pricing",
			tier3Name: "Scale",
			tier3Price: "¥ 3999 / 月",
			tier3Features: "专属顾问\n定制化能力\nSLA 服务",
			tier3CtaLabel: "联系顾问",
			tier3CtaHref: "/default-channel/pages/support",
			highlightTier: "tier2",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：选择合适方案" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：按业务阶段选择最适合的服务包。",
			},
			{ key: "tier1Name", label: "方案1名称", type: "text", placeholder: "例如：Starter" },
			{ key: "tier1Price", label: "方案1价格", type: "text", placeholder: "例如：¥ 999 / 月" },
			{ key: "tier1Features", label: "方案1特性（换行分隔）", type: "textarea", placeholder: "每行一条特性" },
			{ key: "tier1CtaLabel", label: "方案1按钮文案（可选）", type: "text", placeholder: "可选" },
			{ key: "tier1CtaHref", label: "方案1按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "tier2Name", label: "方案2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "tier2Price", label: "方案2价格（可选）", type: "text", placeholder: "可选" },
			{ key: "tier2Features", label: "方案2特性（可选）", type: "textarea", placeholder: "可选" },
			{ key: "tier2CtaLabel", label: "方案2按钮文案（可选）", type: "text", placeholder: "可选" },
			{ key: "tier2CtaHref", label: "方案2按钮链接（可选）", type: "url", placeholder: "可选" },
			{ key: "tier3Name", label: "方案3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "tier3Price", label: "方案3价格（可选）", type: "text", placeholder: "可选" },
			{ key: "tier3Features", label: "方案3特性（可选）", type: "textarea", placeholder: "可选" },
			{ key: "tier3CtaLabel", label: "方案3按钮文案（可选）", type: "text", placeholder: "可选" },
			{ key: "tier3CtaHref", label: "方案3按钮链接（可选）", type: "url", placeholder: "可选" },
			{
				key: "highlightTier",
				label: "高亮方案",
				type: "select",
				options: [
					{ label: "方案1", value: "tier1" },
					{ label: "方案2", value: "tier2" },
					{ label: "方案3", value: "tier3" },
				],
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "service-process-steps",
		title: "服务流程步骤",
		description: "结构化展示合作或交付流程，降低沟通成本。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 83,
		puckComponent: "ServiceProcessStepsSection",
		defaults: {
			type: "service-process-steps",
			heading: "服务流程",
			subtitle: "从需求到上线，关键节点一目了然。",
			step1Title: "需求确认",
			step1Body: "明确目标、范围与排期。",
			step2Title: "方案设计",
			step2Body: "输出页面结构与组件方案。",
			step3Title: "开发联调",
			step3Body: "完成开发并进行联调测试。",
			step4Title: "上线验收",
			step4Body: "上线后复盘并持续优化。",
			note: "每个阶段都可按业务优先级调整。",
			primaryCtaLabel: "预约咨询",
			primaryCtaHref: "/default-channel/pages/support",
			secondaryCtaLabel: "查看案例",
			secondaryCtaHref: "/default-channel/pages/cases",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：服务流程" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：从需求到上线，关键节点一目了然。",
			},
			{ key: "step1Title", label: "步骤1标题", type: "text", placeholder: "例如：需求确认" },
			{ key: "step1Body", label: "步骤1说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "step2Title", label: "步骤2标题（可选）", type: "text", placeholder: "可选" },
			{ key: "step2Body", label: "步骤2说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "step3Title", label: "步骤3标题（可选）", type: "text", placeholder: "可选" },
			{ key: "step3Body", label: "步骤3说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "step4Title", label: "步骤4标题（可选）", type: "text", placeholder: "可选" },
			{ key: "step4Body", label: "步骤4说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "note", label: "补充说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "primaryCtaLabel", label: "主按钮文案（可选）", type: "text", placeholder: "例如：预约咨询" },
			{
				key: "primaryCtaHref",
				label: "主按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/support",
			},
			{ key: "secondaryCtaLabel", label: "次按钮文案（可选）", type: "text", placeholder: "例如：查看案例" },
			{
				key: "secondaryCtaHref",
				label: "次按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/cases",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "inventory-availability-matrix",
		title: "库存可用性矩阵",
		description: "以矩阵方式展示 SKU 库存状态与到货预估。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 84,
		puckComponent: "InventoryAvailabilityMatrixSection",
		defaults: {
			type: "inventory-availability-matrix",
			heading: "库存与到货时间",
			subtitle: "下单前可快速查看当前可用库存。",
			item1Name: "标准版",
			item1Stock: "有货（32）",
			item1Eta: "48 小时内发货",
			item2Name: "进阶版",
			item2Stock: "紧张（6）",
			item2Eta: "3-5 天发货",
			item3Name: "旗舰版",
			item3Stock: "预售",
			item3Eta: "预计 7 天到货",
			warehouseNote: "库存数据每 10 分钟刷新一次，最终以下单页为准。",
			ctaLabel: "查看全部 SKU",
			ctaHref: "/default-channel/products",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：库存与到货时间" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：下单前可快速查看当前可用库存。",
			},
			{ key: "item1Name", label: "条目1名称", type: "text", placeholder: "例如：标准版" },
			{ key: "item1Stock", label: "条目1库存状态", type: "text", placeholder: "例如：有货（32）" },
			{ key: "item1Eta", label: "条目1到货/发货", type: "text", placeholder: "例如：48 小时内发货" },
			{ key: "item2Name", label: "条目2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "item2Stock", label: "条目2库存状态（可选）", type: "text", placeholder: "可选" },
			{ key: "item2Eta", label: "条目2到货/发货（可选）", type: "text", placeholder: "可选" },
			{ key: "item3Name", label: "条目3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "item3Stock", label: "条目3库存状态（可选）", type: "text", placeholder: "可选" },
			{ key: "item3Eta", label: "条目3到货/发货（可选）", type: "text", placeholder: "可选" },
			{ key: "warehouseNote", label: "仓储说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "ctaLabel", label: "按钮文案（可选）", type: "text", placeholder: "例如：查看全部 SKU" },
			{ key: "ctaHref", label: "按钮链接（可选）", type: "url", placeholder: "/default-channel/products" },
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "cross-border-shipping-notice",
		title: "跨境物流提示",
		description: "展示不同地区物流时效和税费提醒，减少售前咨询。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 85,
		puckComponent: "CrossBorderShippingNoticeSection",
		defaults: {
			type: "cross-border-shipping-notice",
			heading: "跨境物流说明",
			subtitle: "不同地区时效和税费规则可能不同，请下单前确认。",
			region1Name: "东南亚",
			region1Eta: "5-9 个工作日",
			region1Duty: "部分国家需买家承担关税",
			region2Name: "中东",
			region2Eta: "7-12 个工作日",
			region2Duty: "清关可能额外 1-3 天",
			region3Name: "欧洲",
			region3Eta: "8-15 个工作日",
			region3Duty: "按目的国税务政策执行",
			policyNote: "若地址偏远，物流商可能收取附加费。",
			primaryCtaLabel: "查看物流政策",
			primaryCtaHref: "/default-channel/pages/shipping",
			secondaryCtaLabel: "联系人工客服",
			secondaryCtaHref: "/default-channel/pages/support",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：跨境物流说明" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：不同地区时效和税费规则可能不同，请下单前确认。",
			},
			{ key: "region1Name", label: "区域1名称", type: "text", placeholder: "例如：东南亚" },
			{ key: "region1Eta", label: "区域1时效", type: "text", placeholder: "例如：5-9 个工作日" },
			{
				key: "region1Duty",
				label: "区域1税费说明",
				type: "text",
				placeholder: "例如：部分国家需买家承担关税",
			},
			{ key: "region2Name", label: "区域2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "region2Eta", label: "区域2时效（可选）", type: "text", placeholder: "可选" },
			{ key: "region2Duty", label: "区域2税费说明（可选）", type: "text", placeholder: "可选" },
			{ key: "region3Name", label: "区域3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "region3Eta", label: "区域3时效（可选）", type: "text", placeholder: "可选" },
			{ key: "region3Duty", label: "区域3税费说明（可选）", type: "text", placeholder: "可选" },
			{ key: "policyNote", label: "补充说明（可选）", type: "textarea", placeholder: "可选" },
			{
				key: "primaryCtaLabel",
				label: "主按钮文案（可选）",
				type: "text",
				placeholder: "例如：查看物流政策",
			},
			{
				key: "primaryCtaHref",
				label: "主按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/shipping",
			},
			{
				key: "secondaryCtaLabel",
				label: "次按钮文案（可选）",
				type: "text",
				placeholder: "例如：联系人工客服",
			},
			{
				key: "secondaryCtaHref",
				label: "次按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/support",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "returns-policy-quick-cards",
		title: "退换政策速览",
		description: "用卡片方式展示退换条件，帮助用户快速理解规则。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 86,
		puckComponent: "ReturnsPolicyQuickCardsSection",
		defaults: {
			type: "returns-policy-quick-cards",
			heading: "退换政策速览",
			subtitle: "核心规则先看这三条，完整政策可查看详情页。",
			card1Title: "7 天无理由",
			card1Body: "未使用且不影响二次销售可申请退货。",
			card1Limit: "部分定制品除外",
			card2Title: "质量问题包退换",
			card2Body: "签收后 48 小时内提交凭证可优先处理。",
			card2Limit: "需保留原包装",
			card3Title: "运费规则",
			card3Body: "非质量问题退货运费由买家承担。",
			card3Limit: "活动商品按活动规则执行",
			ctaLabel: "查看完整退换政策",
			ctaHref: "/default-channel/pages/returns",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：退换政策速览" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：核心规则先看这三条，完整政策可查看详情页。",
			},
			{ key: "card1Title", label: "卡片1标题", type: "text", placeholder: "例如：7 天无理由" },
			{ key: "card1Body", label: "卡片1说明", type: "textarea", placeholder: "请输入说明..." },
			{ key: "card1Limit", label: "卡片1限制（可选）", type: "text", placeholder: "可选" },
			{ key: "card2Title", label: "卡片2标题（可选）", type: "text", placeholder: "可选" },
			{ key: "card2Body", label: "卡片2说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "card2Limit", label: "卡片2限制（可选）", type: "text", placeholder: "可选" },
			{ key: "card3Title", label: "卡片3标题（可选）", type: "text", placeholder: "可选" },
			{ key: "card3Body", label: "卡片3说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "card3Limit", label: "卡片3限制（可选）", type: "text", placeholder: "可选" },
			{ key: "ctaLabel", label: "按钮文案（可选）", type: "text", placeholder: "例如：查看完整退换政策" },
			{
				key: "ctaHref",
				label: "按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/returns",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "compliance-certificates-grid",
		title: "合规资质证书网格",
		description: "展示核心资质证书信息，增强可信度。",
		group: "content",
		tier: "secondary",
		rolloutOrder: 87,
		puckComponent: "ComplianceCertificatesGridSection",
		defaults: {
			type: "compliance-certificates-grid",
			heading: "资质与合规认证",
			subtitle: "我们已通过多项行业认证，保障交付与数据合规。",
			cert1Title: "ISO 27001",
			cert1Code: "CERT-27001-2026",
			cert1Issuer: "SGS",
			cert2Title: "ISO 9001",
			cert2Code: "CERT-9001-2026",
			cert2Issuer: "TÜV",
			cert3Title: "CE",
			cert3Code: "CE-ECOM-8891",
			cert3Issuer: "Intertek",
			cert4Title: "RoHS",
			cert4Code: "ROHS-2026-118",
			cert4Issuer: "BV",
			note: "可按需求提供证书扫描件与编号核验。",
			ctaLabel: "申请证书材料",
			ctaHref: "/default-channel/pages/support",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：资质与合规认证" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：我们已通过多项行业认证。" },
			{ key: "cert1Title", label: "证书1名称", type: "text", placeholder: "例如：ISO 27001" },
			{ key: "cert1Code", label: "证书1编号", type: "text", placeholder: "例如：CERT-27001-2026" },
			{ key: "cert1Issuer", label: "证书1颁发机构", type: "text", placeholder: "例如：SGS" },
			{ key: "cert2Title", label: "证书2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "cert2Code", label: "证书2编号（可选）", type: "text", placeholder: "可选" },
			{ key: "cert2Issuer", label: "证书2颁发机构（可选）", type: "text", placeholder: "可选" },
			{ key: "cert3Title", label: "证书3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "cert3Code", label: "证书3编号（可选）", type: "text", placeholder: "可选" },
			{ key: "cert3Issuer", label: "证书3颁发机构（可选）", type: "text", placeholder: "可选" },
			{ key: "cert4Title", label: "证书4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "cert4Code", label: "证书4编号（可选）", type: "text", placeholder: "可选" },
			{ key: "cert4Issuer", label: "证书4颁发机构（可选）", type: "text", placeholder: "可选" },
			{ key: "note", label: "补充说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "ctaLabel", label: "按钮文案（可选）", type: "text", placeholder: "例如：申请证书材料" },
			{
				key: "ctaHref",
				label: "按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/support",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "bulk-order-inquiry-strip",
		title: "大宗询盘快捷条",
		description: "用于 B2B 大宗采购用户快速提交询盘。",
		group: "commerce",
		tier: "secondary",
		rolloutOrder: 88,
		puckComponent: "BulkOrderInquiryStripSection",
		defaults: {
			type: "bulk-order-inquiry-strip",
			heading: "大宗采购服务",
			subtitle: "支持 OEM/ODM、长期供货和报价优化。",
			minOrderLabel: "起订量",
			minOrderValue: "100 件",
			leadTimeLabel: "交付周期",
			leadTimeValue: "10-20 天",
			customizationLabel: "定制支持",
			customizationValue: "包装 / 标签 / 规格",
			contactLabel: "商务经理",
			contactValue: "bulk@example.com",
			primaryCtaLabel: "提交大宗询盘",
			primaryCtaHref: "/default-channel/pages/support",
			secondaryCtaLabel: "下载产品目录",
			secondaryCtaHref: "/default-channel/pages/catalog",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：大宗采购服务" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：支持 OEM/ODM、长期供货和报价优化。",
			},
			{ key: "minOrderLabel", label: "指标1标签", type: "text", placeholder: "例如：起订量" },
			{ key: "minOrderValue", label: "指标1值", type: "text", placeholder: "例如：100 件" },
			{ key: "leadTimeLabel", label: "指标2标签", type: "text", placeholder: "例如：交付周期" },
			{ key: "leadTimeValue", label: "指标2值", type: "text", placeholder: "例如：10-20 天" },
			{ key: "customizationLabel", label: "指标3标签（可选）", type: "text", placeholder: "可选" },
			{ key: "customizationValue", label: "指标3值（可选）", type: "text", placeholder: "可选" },
			{ key: "contactLabel", label: "联系项标签（可选）", type: "text", placeholder: "例如：商务经理" },
			{ key: "contactValue", label: "联系项值（可选）", type: "text", placeholder: "例如：bulk@example.com" },
			{
				key: "primaryCtaLabel",
				label: "主按钮文案（可选）",
				type: "text",
				placeholder: "例如：提交大宗询盘",
			},
			{
				key: "primaryCtaHref",
				label: "主按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/support",
			},
			{
				key: "secondaryCtaLabel",
				label: "次按钮文案（可选）",
				type: "text",
				placeholder: "例如：下载产品目录",
			},
			{
				key: "secondaryCtaHref",
				label: "次按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/catalog",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "regional-service-map-lite",
		title: "区域服务覆盖简图",
		description: "按区域展示覆盖范围和 SLA 承诺。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 89,
		puckComponent: "RegionalServiceMapLiteSection",
		defaults: {
			type: "regional-service-map-lite",
			heading: "区域服务覆盖",
			subtitle: "我们在重点区域提供本地化服务响应。",
			region1Name: "华东",
			region1Coverage: "上海 / 江苏 / 浙江",
			region1Sla: "4 小时响应",
			region2Name: "华南",
			region2Coverage: "广东 / 福建",
			region2Sla: "6 小时响应",
			region3Name: "东南亚",
			region3Coverage: "新加坡 / 马来西亚 / 泰国",
			region3Sla: "8 小时响应",
			region4Name: "欧洲",
			region4Coverage: "德国 / 法国 / 英国",
			region4Sla: "12 小时响应",
			note: "最终服务范围以合同条款为准。",
			ctaLabel: "联系区域顾问",
			ctaHref: "/default-channel/pages/support",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：区域服务覆盖" },
			{
				key: "subtitle",
				label: "副标题",
				type: "textarea",
				placeholder: "例如：我们在重点区域提供本地化服务响应。",
			},
			{ key: "region1Name", label: "区域1名称", type: "text", placeholder: "例如：华东" },
			{
				key: "region1Coverage",
				label: "区域1覆盖范围",
				type: "text",
				placeholder: "例如：上海 / 江苏 / 浙江",
			},
			{ key: "region1Sla", label: "区域1 SLA", type: "text", placeholder: "例如：4 小时响应" },
			{ key: "region2Name", label: "区域2名称（可选）", type: "text", placeholder: "可选" },
			{ key: "region2Coverage", label: "区域2覆盖范围（可选）", type: "text", placeholder: "可选" },
			{ key: "region2Sla", label: "区域2 SLA（可选）", type: "text", placeholder: "可选" },
			{ key: "region3Name", label: "区域3名称（可选）", type: "text", placeholder: "可选" },
			{ key: "region3Coverage", label: "区域3覆盖范围（可选）", type: "text", placeholder: "可选" },
			{ key: "region3Sla", label: "区域3 SLA（可选）", type: "text", placeholder: "可选" },
			{ key: "region4Name", label: "区域4名称（可选）", type: "text", placeholder: "可选" },
			{ key: "region4Coverage", label: "区域4覆盖范围（可选）", type: "text", placeholder: "可选" },
			{ key: "region4Sla", label: "区域4 SLA（可选）", type: "text", placeholder: "可选" },
			{ key: "note", label: "补充说明（可选）", type: "textarea", placeholder: "可选" },
			{ key: "ctaLabel", label: "按钮文案（可选）", type: "text", placeholder: "例如：联系区域顾问" },
			{
				key: "ctaHref",
				label: "按钮链接（可选）",
				type: "url",
				placeholder: "/default-channel/pages/support",
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "container",
		title: "通用容器",
		description: "可配置背景、文字、按钮、对齐与字号的内容块。",
		group: "layout",
		tier: "must-have",
		rolloutOrder: 90,
		puckComponent: "ContainerSection",
		defaults: {
			type: "container",
			eyebrow: "推荐",
			heading: "可自由配置的容器区块",
			body: "支持背景图/背景色、文字颜色、按钮样式与大小。",
			backgroundColor: "#ffffff",
			backgroundImageUrl: "",
			textColor: "",
			contentAlign: "left",
			widthMode: "normal",
			minHeight: 220,
			paddingX: 32,
			paddingY: 32,
			titleSize: "lg",
			bodySize: "md",
			buttonLabel: "了解更多",
			buttonHref: "/products",
			buttonVariant: "solid",
			buttonSize: "md",
			style: {
				background: { mode: "custom", color: "#ffffff" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
				minHeight: 220,
				paddingX: 32,
				paddingY: 32,
			},
		},
		fields: [
			{ key: "eyebrow", label: "上方短标题", type: "text", placeholder: "例如：推荐" },
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：可自由配置的容器区块" },
			{ key: "body", label: "正文", type: "textarea", placeholder: "在这里输入容器正文..." },
			{ key: "backgroundColor", label: "背景色", type: "color", placeholder: "#ffffff" },
			{
				key: "backgroundImageUrl",
				label: "背景图片",
				type: "imageUpload",
				placeholder: "点击上传，或粘贴图片 URL",
				helpText: "支持上传（走 Saleor 存储）或手动输入 URL。",
			},
			{ key: "textColor", label: "文字颜色", type: "color", placeholder: "#0f172a" },
			{
				key: "contentAlign",
				label: "内容对齐",
				type: "select",
				options: [
					{ label: "左对齐", value: "left" },
					{ label: "居中", value: "center" },
				],
			},
			{
				key: "widthMode",
				label: "区块宽度",
				type: "select",
				options: [
					{ label: "窄", value: "narrow" },
					{ label: "标准", value: "normal" },
					{ label: "宽", value: "wide" },
					{ label: "全宽", value: "full" },
				],
			},
			{
				key: "minHeight",
				label: "最小高度（px）",
				type: "number",
				min: MIN_SECTION_MIN_HEIGHT,
				max: MAX_SECTION_MIN_HEIGHT,
			},
			{
				key: "paddingX",
				label: "左右内边距（px）",
				type: "number",
				min: MIN_SECTION_PADDING,
				max: MAX_SECTION_PADDING,
			},
			{
				key: "paddingY",
				label: "上下内边距（px）",
				type: "number",
				min: MIN_SECTION_PADDING,
				max: MAX_SECTION_PADDING,
			},
			{
				key: "titleSize",
				label: "标题大小",
				type: "select",
				options: [
					{ label: "中", value: "md" },
					{ label: "大", value: "lg" },
					{ label: "超大", value: "xl" },
				],
			},
			{
				key: "bodySize",
				label: "正文字号",
				type: "select",
				options: [
					{ label: "小", value: "sm" },
					{ label: "中", value: "md" },
					{ label: "大", value: "lg" },
				],
			},
			{ key: "buttonLabel", label: "按钮文字", type: "text", placeholder: "例如：了解更多" },
			{ key: "buttonHref", label: "按钮链接", type: "url", placeholder: "/products" },
			{
				key: "buttonVariant",
				label: "按钮样式",
				type: "select",
				options: [
					{ label: "实心", value: "solid" },
					{ label: "描边", value: "outline" },
				],
			},
			{
				key: "buttonSize",
				label: "按钮大小",
				type: "select",
				options: [
					{ label: "小", value: "sm" },
					{ label: "中", value: "md" },
					{ label: "大", value: "lg" },
				],
			},
			...createStyleModeFields(),
			...createSharedStyleFields({
				includeSpacing: true,
				includeShape: true,
			}),
		],
	},
	{
		type: "button-row",
		title: "按钮组",
		description: "用于放置两个快速操作按钮。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 91,
		puckComponent: "ButtonRowSection",
		defaults: {
			type: "button-row",
			heading: "快速入口",
			subtitle: "引导访客访问重点页面。",
			primaryLabel: "查看全部商品",
			primaryHref: "/products",
			secondaryLabel: "联系我们",
			secondaryHref: "/default-channel/pages/support",
			buttonSize: "md",
			align: "left",
			style: {
				background: { mode: "none" },
				container: { width: "boxed", maxWidth: "lg" },
				spacing: { top: "md", bottom: "md" },
				alignment: "left",
				shape: { radius: "md", shadow: "sm" },
			},
		},
		fields: [
			{ key: "heading", label: "标题", type: "text", placeholder: "例如：快速入口" },
			{ key: "subtitle", label: "副标题", type: "textarea", placeholder: "例如：引导访客访问重点页面。" },
			{ key: "primaryLabel", label: "主按钮文字", type: "text", placeholder: "例如：查看全部商品" },
			{ key: "primaryHref", label: "主按钮链接", type: "url", placeholder: "/products" },
			{ key: "secondaryLabel", label: "次按钮文字", type: "text", placeholder: "例如：联系我们" },
			{
				key: "secondaryHref",
				label: "次按钮链接",
				type: "url",
				placeholder: "/default-channel/pages/support",
			},
			{
				key: "buttonSize",
				label: "按钮大小",
				type: "select",
				options: [
					{ label: "小", value: "sm" },
					{ label: "中", value: "md" },
					{ label: "大", value: "lg" },
				],
			},
			{
				key: "align",
				label: "对齐方式",
				type: "select",
				options: [
					{ label: "左对齐", value: "left" },
					{ label: "居中", value: "center" },
				],
			},
			...createSharedStyleFields({
				includeBackground: true,
				includeContainer: true,
				includeSpacing: true,
				includeShape: true,
				includeTextColor: true,
			}),
		],
	},
	{
		type: "spacer",
		title: "间距块",
		description: "用于控制上下留白。",
		group: "utility",
		tier: "secondary",
		rolloutOrder: 92,
		puckComponent: "SpacerSection",
		defaults: {
			type: "spacer",
			height: 48,
		},
		fields: [
			{
				key: "height",
				label: "高度（px）",
				type: "number",
				min: MIN_SPACER_HEIGHT,
				max: MAX_SPACER_HEIGHT,
				helpText: `允许范围：${MIN_SPACER_HEIGHT}-${MAX_SPACER_HEIGHT}`,
			},
		],
	},
];

export function getHomepageSectionRegistry(): HomepageSectionRegistryItem[] {
	return HOMEPAGE_SECTION_REGISTRY;
}

export function getDefaultHomepageLayout(): HomepageLayout {
	const featuredProductsDefaults = HOMEPAGE_SECTION_REGISTRY.find(
		(section) => section.type === "featured-products",
	)?.defaults as HomepageFeaturedProductsSection | undefined;
	return {
		schemaVersion: HOMEPAGE_LAYOUT_SCHEMA_VERSION,
		sections: [
			featuredProductsDefaults || {
				type: "featured-products",
				collectionSlug: "featured-products",
				limit: 12,
			},
		],
	};
}

export const DEFAULT_HOMEPAGE_LAYOUT: HomepageLayout = getDefaultHomepageLayout();

type HeaderValues = {
	homepageLayout?: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function toCleanString(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	return trimmed || undefined;
}

function toPositiveIntInRange(value: unknown, min: number, max: number): number | undefined {
	if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
	const rounded = Math.floor(value);
	if (rounded < min || rounded > max) return undefined;
	return rounded;
}

function normalizeLegacyWidthMode(value: unknown): "narrow" | "normal" | "wide" | "full" {
	if (value === "narrow" || value === "wide" || value === "full") return value;
	return "normal";
}

function legacyWidthModeToContainer(
	mode: "narrow" | "normal" | "wide" | "full",
): HomepageStyleProps["container"] {
	if (mode === "full") return { width: "full", maxWidth: "xl" };
	if (mode === "wide") return { width: "boxed", maxWidth: "xl" };
	if (mode === "narrow") return { width: "boxed", maxWidth: "md" };
	return { width: "boxed", maxWidth: "lg" };
}

function sanitizeStyleProps(value: Record<string, unknown>): HomepageStyleProps {
	const style = isRecord(value.style) ? value.style : {};
	const styleBackground = isRecord(style.background) ? style.background : {};
	const styleContainer = isRecord(style.container) ? style.container : {};
	const styleSpacing = isRecord(style.spacing) ? style.spacing : {};
	const styleShape = isRecord(style.shape) ? style.shape : {};

	const alignment =
		style.alignment === "center" || value.contentAlign === "center" || value.align === "center"
			? "center"
			: "left";
	const widthMode = normalizeLegacyWidthMode(value.widthMode);
	const containerWidth = styleContainer.width === "full" ? "full" : "boxed";
	const containerMaxWidth =
		styleContainer.maxWidth === "sm" || styleContainer.maxWidth === "md" || styleContainer.maxWidth === "xl"
			? styleContainer.maxWidth
			: "lg";
	const legacyContainer = legacyWidthModeToContainer(widthMode);
	const container: HomepageStyleProps["container"] = {
		width: containerWidth || legacyContainer.width,
		maxWidth: containerMaxWidth || legacyContainer.maxWidth,
	};
	if (!styleContainer.width && !styleContainer.maxWidth) {
		container.width = legacyContainer.width;
		container.maxWidth = legacyContainer.maxWidth;
	}

	const backgroundColor = toCleanString(value.backgroundColor);
	const backgroundImageUrl = toCleanString(value.backgroundImageUrl);
	const backgroundMode: HomepageStyleProps["background"]["mode"] =
		styleBackground.mode === "token" || styleBackground.mode === "image" || styleBackground.mode === "custom"
			? styleBackground.mode
			: value.backgroundMode === "token" ||
				  value.backgroundMode === "image" ||
				  value.backgroundMode === "custom"
				? value.backgroundMode
				: backgroundImageUrl
					? "image"
					: backgroundColor
						? "custom"
						: "none";
	const backgroundToken =
		styleBackground.token === "background" ||
		styleBackground.token === "card" ||
		styleBackground.token === "muted" ||
		styleBackground.token === "secondary" ||
		styleBackground.token === "accent"
			? styleBackground.token
			: value.backgroundToken === "background" ||
				  value.backgroundToken === "card" ||
				  value.backgroundToken === "muted" ||
				  value.backgroundToken === "secondary" ||
				  value.backgroundToken === "accent"
				? value.backgroundToken
				: undefined;

	const spacingTop =
		styleSpacing.top === "none" ||
		styleSpacing.top === "sm" ||
		styleSpacing.top === "md" ||
		styleSpacing.top === "lg"
			? styleSpacing.top
			: value.spacingTop === "none" ||
				  value.spacingTop === "sm" ||
				  value.spacingTop === "md" ||
				  value.spacingTop === "lg"
				? value.spacingTop
				: "md";
	const spacingBottom =
		styleSpacing.bottom === "none" ||
		styleSpacing.bottom === "sm" ||
		styleSpacing.bottom === "md" ||
		styleSpacing.bottom === "lg"
			? styleSpacing.bottom
			: value.spacingBottom === "none" ||
				  value.spacingBottom === "sm" ||
				  value.spacingBottom === "md" ||
				  value.spacingBottom === "lg"
				? value.spacingBottom
				: "md";

	const radius =
		styleShape.radius === "none" ||
		styleShape.radius === "sm" ||
		styleShape.radius === "md" ||
		styleShape.radius === "lg"
			? styleShape.radius
			: value.cornerRadius === "none" ||
				  value.cornerRadius === "sm" ||
				  value.cornerRadius === "md" ||
				  value.cornerRadius === "lg"
				? value.cornerRadius
				: "md";
	const shadow =
		styleShape.shadow === "none" ||
		styleShape.shadow === "sm" ||
		styleShape.shadow === "md" ||
		styleShape.shadow === "lg"
			? styleShape.shadow
			: value.shadowPreset === "none" ||
				  value.shadowPreset === "sm" ||
				  value.shadowPreset === "md" ||
				  value.shadowPreset === "lg"
				? value.shadowPreset
				: "md";

	return {
		background: {
			mode: backgroundMode,
			token: backgroundToken,
			color: toCleanString(styleBackground.color) || backgroundColor,
			imageUrl: toCleanString(styleBackground.imageUrl) || backgroundImageUrl,
		},
		container,
		spacing: {
			top: spacingTop,
			bottom: spacingBottom,
		},
		alignment,
		shape: {
			radius,
			shadow,
		},
		textColor: toCleanString(style.textColor) || toCleanString(value.textColor),
		minHeight:
			toPositiveIntInRange(style.minHeight, MIN_SECTION_MIN_HEIGHT, MAX_SECTION_MIN_HEIGHT) ||
			toPositiveIntInRange(value.minHeight, MIN_SECTION_MIN_HEIGHT, MAX_SECTION_MIN_HEIGHT),
		paddingX:
			toPositiveIntInRange(style.paddingX, MIN_SECTION_PADDING, MAX_SECTION_PADDING) ||
			toPositiveIntInRange(value.paddingX, MIN_SECTION_PADDING, MAX_SECTION_PADDING),
		paddingY:
			toPositiveIntInRange(style.paddingY, MIN_SECTION_PADDING, MAX_SECTION_PADDING) ||
			toPositiveIntInRange(value.paddingY, MIN_SECTION_PADDING, MAX_SECTION_PADDING),
	};
}

function sanitizeFeaturedProductsSection(
	value: Record<string, unknown>,
): HomepageFeaturedProductsSection | null {
	const heading = toCleanString(value.heading);
	const collectionSlug = toCleanString(value.collectionSlug) || "featured-products";
	const limit =
		toPositiveIntInRange(value.limit, MIN_PRODUCT_LIMIT, MAX_PRODUCT_LIMIT) || DEFAULT_PRODUCT_LIMIT;
	return {
		type: "featured-products",
		heading,
		collectionSlug,
		limit,
		style: sanitizeStyleProps(value),
	};
}

function sanitizeHeroSection(value: Record<string, unknown>): HomepageHeroSection | null {
	const title = toCleanString(value.title);
	if (!title) return null;
	return {
		type: "hero",
		title,
		eyebrow: toCleanString(value.eyebrow),
		subtitle: toCleanString(value.subtitle),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		backgroundColor: toCleanString(value.backgroundColor),
		backgroundImageUrl: toCleanString(value.backgroundImageUrl),
		textColor: toCleanString(value.textColor),
		contentAlign: value.contentAlign === "center" ? "center" : "left",
		widthMode:
			value.widthMode === "narrow" || value.widthMode === "wide" || value.widthMode === "full"
				? value.widthMode
				: "normal",
		minHeight: toPositiveIntInRange(value.minHeight, MIN_SECTION_MIN_HEIGHT, MAX_SECTION_MIN_HEIGHT),
		paddingX: toPositiveIntInRange(value.paddingX, MIN_SECTION_PADDING, MAX_SECTION_PADDING),
		paddingY: toPositiveIntInRange(value.paddingY, MIN_SECTION_PADDING, MAX_SECTION_PADDING),
		titleSize: value.titleSize === "lg" || value.titleSize === "2xl" ? value.titleSize : "xl",
		buttonVariant: value.buttonVariant === "outline" ? "outline" : "solid",
		buttonSize: value.buttonSize === "sm" || value.buttonSize === "lg" ? value.buttonSize : "md",
		style: sanitizeStyleProps(value),
	};
}

function sanitizeRichTextSection(value: Record<string, unknown>): HomepageRichTextSection | null {
	const heading = toCleanString(value.heading);
	const body = toCleanString(value.body);
	if (!heading && !body) return null;
	return {
		type: "rich-text",
		heading,
		body,
		style: sanitizeStyleProps(value),
	};
}

function sanitizeHeadingSection(value: Record<string, unknown>): HomepageHeadingSection | null {
	const title = toCleanString(value.title);
	if (!title) return null;
	return {
		type: "heading",
		eyebrow: toCleanString(value.eyebrow),
		title,
		subtitle: toCleanString(value.subtitle),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		titleSize: value.titleSize === "md" || value.titleSize === "xl" ? value.titleSize : "lg",
		style: sanitizeStyleProps(value),
	};
}

function sanitizeImageBannerSection(value: Record<string, unknown>): HomepageImageBannerSection | null {
	const heading = toCleanString(value.heading);
	const body = toCleanString(value.body);
	const imageUrl = toCleanString(value.imageUrl);
	if (!heading && !body && !imageUrl) return null;
	return {
		type: "image-banner",
		eyebrow: toCleanString(value.eyebrow),
		heading,
		body,
		imageUrl,
		imageAlt: toCleanString(value.imageAlt),
		imageFit: value.imageFit === "contain" ? "contain" : "cover",
		imagePosition:
			value.imagePosition === "left" || value.imagePosition === "top" ? value.imagePosition : "right",
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function normalizeColumns(value: unknown): 2 | 3 | 4 {
	const parsed =
		typeof value === "number" && Number.isFinite(value)
			? Math.floor(value)
			: typeof value === "string"
				? Number.parseInt(value, 10)
				: NaN;
	if (parsed === 2 || parsed === 4) return parsed;
	return 3;
}

function normalizeCategoryLimit(value: unknown): number {
	const parsed =
		typeof value === "number" && Number.isFinite(value)
			? Math.floor(value)
			: typeof value === "string"
				? Number.parseInt(value, 10)
				: NaN;
	if (!Number.isFinite(parsed)) return DEFAULT_CATEGORY_LIMIT;
	return Math.max(MIN_CATEGORY_LIMIT, Math.min(MAX_CATEGORY_LIMIT, parsed));
}

function sanitizeIconListSection(value: Record<string, unknown>): HomepageIconListSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const item1Title = toCleanString(value.item1Title);
	const item2Title = toCleanString(value.item2Title);
	const item3Title = toCleanString(value.item3Title);
	const item4Title = toCleanString(value.item4Title);
	if (!heading && !subtitle && !item1Title && !item2Title && !item3Title && !item4Title) return null;
	return {
		type: "icon-list",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		item1Icon: toCleanString(value.item1Icon),
		item1Title,
		item1Description: toCleanString(value.item1Description),
		item2Icon: toCleanString(value.item2Icon),
		item2Title,
		item2Description: toCleanString(value.item2Description),
		item3Icon: toCleanString(value.item3Icon),
		item3Title,
		item3Description: toCleanString(value.item3Description),
		item4Icon: toCleanString(value.item4Icon),
		item4Title,
		item4Description: toCleanString(value.item4Description),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeFaqAccordionSection(value: Record<string, unknown>): HomepageFaqAccordionSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const q1Question = toCleanString(value.q1Question);
	const q2Question = toCleanString(value.q2Question);
	const q3Question = toCleanString(value.q3Question);
	const q4Question = toCleanString(value.q4Question);
	const q5Question = toCleanString(value.q5Question);
	if (!heading && !subtitle && !q1Question && !q2Question && !q3Question && !q4Question && !q5Question)
		return null;
	return {
		type: "faq-accordion",
		heading,
		subtitle,
		q1Question,
		q1Answer: toCleanString(value.q1Answer),
		q2Question,
		q2Answer: toCleanString(value.q2Answer),
		q3Question,
		q3Answer: toCleanString(value.q3Answer),
		q4Question,
		q4Answer: toCleanString(value.q4Answer),
		q5Question,
		q5Answer: toCleanString(value.q5Answer),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeFeaturedCollectionsSection(
	value: Record<string, unknown>,
): HomepageFeaturedCollectionsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const collectionSlug1 = toCleanString(value.collectionSlug1);
	const collectionSlug2 = toCleanString(value.collectionSlug2);
	const collectionSlug3 = toCleanString(value.collectionSlug3);
	const collectionSlug4 = toCleanString(value.collectionSlug4);
	if (!heading && !subtitle && !collectionSlug1 && !collectionSlug2 && !collectionSlug3 && !collectionSlug4)
		return null;
	return {
		type: "featured-collections",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		collectionSlug1,
		collectionSlug2,
		collectionSlug3,
		collectionSlug4,
		style: sanitizeStyleProps(value),
	};
}

function sanitizePromoBannerSection(value: Record<string, unknown>): HomepagePromoBannerSection | null {
	const title = toCleanString(value.title);
	const subtitle = toCleanString(value.subtitle);
	const badgeText = toCleanString(value.badgeText);
	if (!title && !subtitle && !badgeText) return null;
	return {
		type: "promo-banner",
		eyebrow: toCleanString(value.eyebrow),
		title,
		subtitle,
		badgeText,
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		secondaryCtaLabel: toCleanString(value.secondaryCtaLabel),
		secondaryCtaHref: toCleanString(value.secondaryCtaHref),
		scheduleMode: value.scheduleMode === "window" ? "window" : "always",
		scheduleStartIso: toCleanString(value.scheduleStartIso),
		scheduleEndIso: toCleanString(value.scheduleEndIso),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeTestimonialsSection(value: Record<string, unknown>): HomepageTestimonialsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const item1Quote = toCleanString(value.item1Quote);
	const item2Quote = toCleanString(value.item2Quote);
	const item3Quote = toCleanString(value.item3Quote);
	if (!heading && !subtitle && !item1Quote && !item2Quote && !item3Quote) return null;
	return {
		type: "testimonials",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		item1Quote,
		item1Author: toCleanString(value.item1Author),
		item1Role: toCleanString(value.item1Role),
		item1AvatarUrl: toCleanString(value.item1AvatarUrl),
		item2Quote,
		item2Author: toCleanString(value.item2Author),
		item2Role: toCleanString(value.item2Role),
		item2AvatarUrl: toCleanString(value.item2AvatarUrl),
		item3Quote,
		item3Author: toCleanString(value.item3Author),
		item3Role: toCleanString(value.item3Role),
		item3AvatarUrl: toCleanString(value.item3AvatarUrl),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeStorePoliciesSection(value: Record<string, unknown>): HomepageStorePoliciesSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const policy1Label = toCleanString(value.policy1Label);
	const policy2Label = toCleanString(value.policy2Label);
	const policy3Label = toCleanString(value.policy3Label);
	const policy4Label = toCleanString(value.policy4Label);
	if (!heading && !subtitle && !policy1Label && !policy2Label && !policy3Label && !policy4Label) return null;
	return {
		type: "store-policies",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		policy1Label,
		policy1Href: toCleanString(value.policy1Href),
		policy1Description: toCleanString(value.policy1Description),
		policy2Label,
		policy2Href: toCleanString(value.policy2Href),
		policy2Description: toCleanString(value.policy2Description),
		policy3Label,
		policy3Href: toCleanString(value.policy3Href),
		policy3Description: toCleanString(value.policy3Description),
		policy4Label,
		policy4Href: toCleanString(value.policy4Href),
		policy4Description: toCleanString(value.policy4Description),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeCategoryGridSection(value: Record<string, unknown>): HomepageCategoryGridSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const categorySlug1 = toCleanString(value.categorySlug1);
	const categorySlug2 = toCleanString(value.categorySlug2);
	const categorySlug3 = toCleanString(value.categorySlug3);
	const categorySlug4 = toCleanString(value.categorySlug4);
	const categorySlug5 = toCleanString(value.categorySlug5);
	const categorySlug6 = toCleanString(value.categorySlug6);
	if (
		!heading &&
		!subtitle &&
		!categorySlug1 &&
		!categorySlug2 &&
		!categorySlug3 &&
		!categorySlug4 &&
		!categorySlug5 &&
		!categorySlug6
	)
		return null;
	return {
		type: "category-grid",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		categorySlug1,
		categoryLabel1: toCleanString(value.categoryLabel1),
		categorySlug2,
		categoryLabel2: toCleanString(value.categoryLabel2),
		categorySlug3,
		categoryLabel3: toCleanString(value.categoryLabel3),
		categorySlug4,
		categoryLabel4: toCleanString(value.categoryLabel4),
		categorySlug5,
		categoryLabel5: toCleanString(value.categoryLabel5),
		categorySlug6,
		categoryLabel6: toCleanString(value.categoryLabel6),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeProductSpotlightSection(
	value: Record<string, unknown>,
): HomepageProductSpotlightSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const productSlug = toCleanString(value.productSlug);
	const productName = toCleanString(value.productName);
	if (!heading && !subtitle && !productSlug && !productName) return null;
	return {
		type: "product-spotlight",
		heading,
		subtitle,
		badgeText: toCleanString(value.badgeText),
		productSlug,
		productName,
		priceText: toCleanString(value.priceText),
		imageUrl: toCleanString(value.imageUrl),
		imageAlt: toCleanString(value.imageAlt),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeCountdownSection(value: Record<string, unknown>): HomepageCountdownSection | null {
	const heading = toCleanString(value.heading);
	const targetIso = toCleanString(value.targetIso);
	const subtitle = toCleanString(value.subtitle);
	if (!heading && !targetIso && !subtitle) return null;
	return {
		type: "countdown",
		heading,
		subtitle,
		targetIso,
		timezoneLabel: toCleanString(value.timezoneLabel),
		expiredMessage: toCleanString(value.expiredMessage),
		mode: value.mode === "hide-after-expired" ? "hide-after-expired" : "always",
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeFeaturedCategoriesAutoSection(
	value: Record<string, unknown>,
): HomepageFeaturedCategoriesAutoSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const mode = value.mode === "manual" ? "manual" : "auto";
	const manualCategorySlug1 = toCleanString(value.manualCategorySlug1);
	const manualCategorySlug2 = toCleanString(value.manualCategorySlug2);
	const manualCategorySlug3 = toCleanString(value.manualCategorySlug3);
	const manualCategorySlug4 = toCleanString(value.manualCategorySlug4);
	const manualCategorySlug5 = toCleanString(value.manualCategorySlug5);
	const manualCategorySlug6 = toCleanString(value.manualCategorySlug6);
	const hasManualValues =
		!!manualCategorySlug1 ||
		!!manualCategorySlug2 ||
		!!manualCategorySlug3 ||
		!!manualCategorySlug4 ||
		!!manualCategorySlug5 ||
		!!manualCategorySlug6;
	if (!heading && !subtitle && mode === "manual" && !hasManualValues) return null;
	return {
		type: "featured-categories-auto",
		heading,
		subtitle,
		mode,
		autoLimit: normalizeCategoryLimit(value.autoLimit),
		columns: normalizeColumns(value.columns),
		manualCategorySlug1,
		manualCategoryLabel1: toCleanString(value.manualCategoryLabel1),
		manualCategorySlug2,
		manualCategoryLabel2: toCleanString(value.manualCategoryLabel2),
		manualCategorySlug3,
		manualCategoryLabel3: toCleanString(value.manualCategoryLabel3),
		manualCategorySlug4,
		manualCategoryLabel4: toCleanString(value.manualCategoryLabel4),
		manualCategorySlug5,
		manualCategoryLabel5: toCleanString(value.manualCategoryLabel5),
		manualCategorySlug6,
		manualCategoryLabel6: toCleanString(value.manualCategoryLabel6),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeLogoCloudSection(value: Record<string, unknown>): HomepageLogoCloudSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const logo1Url = toCleanString(value.logo1Url);
	const logo2Url = toCleanString(value.logo2Url);
	const logo3Url = toCleanString(value.logo3Url);
	const logo4Url = toCleanString(value.logo4Url);
	const logo5Url = toCleanString(value.logo5Url);
	const logo6Url = toCleanString(value.logo6Url);
	if (!heading && !subtitle && !logo1Url && !logo2Url && !logo3Url && !logo4Url && !logo5Url && !logo6Url)
		return null;
	return {
		type: "logo-cloud",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		logo1Url,
		logo1Alt: toCleanString(value.logo1Alt),
		logo2Url,
		logo2Alt: toCleanString(value.logo2Alt),
		logo3Url,
		logo3Alt: toCleanString(value.logo3Alt),
		logo4Url,
		logo4Alt: toCleanString(value.logo4Alt),
		logo5Url,
		logo5Alt: toCleanString(value.logo5Alt),
		logo6Url,
		logo6Alt: toCleanString(value.logo6Alt),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeTimelineStepsSection(value: Record<string, unknown>): HomepageTimelineStepsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const step1Title = toCleanString(value.step1Title);
	const step2Title = toCleanString(value.step2Title);
	const step3Title = toCleanString(value.step3Title);
	const step4Title = toCleanString(value.step4Title);
	if (!heading && !subtitle && !step1Title && !step2Title && !step3Title && !step4Title) return null;
	return {
		type: "timeline-steps",
		heading,
		subtitle,
		step1Title,
		step1Description: toCleanString(value.step1Description),
		step2Title,
		step2Description: toCleanString(value.step2Description),
		step3Title,
		step3Description: toCleanString(value.step3Description),
		step4Title,
		step4Description: toCleanString(value.step4Description),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeCollectionHeroSection(value: Record<string, unknown>): HomepageCollectionHeroSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const collectionSlug = toCleanString(value.collectionSlug);
	if (!heading && !subtitle && !collectionSlug) return null;
	return {
		type: "collection-hero",
		eyebrow: toCleanString(value.eyebrow),
		heading,
		subtitle,
		collectionSlug,
		collectionLabel: toCleanString(value.collectionLabel),
		backgroundImageUrl: toCleanString(value.backgroundImageUrl),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeContactQuickActionsSection(
	value: Record<string, unknown>,
): HomepageContactQuickActionsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const action1Label = toCleanString(value.action1Label);
	const action2Label = toCleanString(value.action2Label);
	const action3Label = toCleanString(value.action3Label);
	const action4Label = toCleanString(value.action4Label);
	if (!heading && !subtitle && !action1Label && !action2Label && !action3Label && !action4Label) return null;
	return {
		type: "contact-quick-actions",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		action1Label,
		action1Value: toCleanString(value.action1Value),
		action1Href: toCleanString(value.action1Href),
		action1Description: toCleanString(value.action1Description),
		action2Label,
		action2Value: toCleanString(value.action2Value),
		action2Href: toCleanString(value.action2Href),
		action2Description: toCleanString(value.action2Description),
		action3Label,
		action3Value: toCleanString(value.action3Value),
		action3Href: toCleanString(value.action3Href),
		action3Description: toCleanString(value.action3Description),
		action4Label,
		action4Value: toCleanString(value.action4Value),
		action4Href: toCleanString(value.action4Href),
		action4Description: toCleanString(value.action4Description),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeStatsCounterSection(value: Record<string, unknown>): HomepageStatsCounterSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const item1Value = toCleanString(value.item1Value);
	const item2Value = toCleanString(value.item2Value);
	const item3Value = toCleanString(value.item3Value);
	const item4Value = toCleanString(value.item4Value);
	if (!heading && !subtitle && !item1Value && !item2Value && !item3Value && !item4Value) return null;
	return {
		type: "stats-counter",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		item1Label: toCleanString(value.item1Label),
		item1Value,
		item1Suffix: toCleanString(value.item1Suffix),
		item2Label: toCleanString(value.item2Label),
		item2Value,
		item2Suffix: toCleanString(value.item2Suffix),
		item3Label: toCleanString(value.item3Label),
		item3Value,
		item3Suffix: toCleanString(value.item3Suffix),
		item4Label: toCleanString(value.item4Label),
		item4Value,
		item4Suffix: toCleanString(value.item4Suffix),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeCardGridSection(value: Record<string, unknown>): HomepageCardGridSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const card1Title = toCleanString(value.card1Title);
	const card2Title = toCleanString(value.card2Title);
	const card3Title = toCleanString(value.card3Title);
	const card4Title = toCleanString(value.card4Title);
	const card5Title = toCleanString(value.card5Title);
	const card6Title = toCleanString(value.card6Title);
	if (
		!heading &&
		!subtitle &&
		!card1Title &&
		!card2Title &&
		!card3Title &&
		!card4Title &&
		!card5Title &&
		!card6Title
	)
		return null;
	return {
		type: "card-grid",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		card1Title,
		card1Body: toCleanString(value.card1Body),
		card1CtaLabel: toCleanString(value.card1CtaLabel),
		card1CtaHref: toCleanString(value.card1CtaHref),
		card2Title,
		card2Body: toCleanString(value.card2Body),
		card2CtaLabel: toCleanString(value.card2CtaLabel),
		card2CtaHref: toCleanString(value.card2CtaHref),
		card3Title,
		card3Body: toCleanString(value.card3Body),
		card3CtaLabel: toCleanString(value.card3CtaLabel),
		card3CtaHref: toCleanString(value.card3CtaHref),
		card4Title,
		card4Body: toCleanString(value.card4Body),
		card4CtaLabel: toCleanString(value.card4CtaLabel),
		card4CtaHref: toCleanString(value.card4CtaHref),
		card5Title,
		card5Body: toCleanString(value.card5Body),
		card5CtaLabel: toCleanString(value.card5CtaLabel),
		card5CtaHref: toCleanString(value.card5CtaHref),
		card6Title,
		card6Body: toCleanString(value.card6Body),
		card6CtaLabel: toCleanString(value.card6CtaLabel),
		card6CtaHref: toCleanString(value.card6CtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeNewsletterSignupSection(
	value: Record<string, unknown>,
): HomepageNewsletterSignupSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const buttonLabel = toCleanString(value.buttonLabel);
	if (!heading && !subtitle && !buttonLabel) return null;
	return {
		type: "newsletter-signup",
		heading,
		subtitle,
		inputPlaceholder: toCleanString(value.inputPlaceholder),
		buttonLabel,
		privacyNote: toCleanString(value.privacyNote),
		actionHref: toCleanString(value.actionHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeVideoEmbedSection(value: Record<string, unknown>): HomepageVideoEmbedSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const videoUrl = toCleanString(value.videoUrl);
	if (!heading && !subtitle && !videoUrl) return null;
	const aspectRatioRaw = toCleanString(value.aspectRatio);
	const aspectRatio = aspectRatioRaw === "4-3" || aspectRatioRaw === "1-1" ? aspectRatioRaw : "16-9";
	return {
		type: "video-embed",
		heading,
		subtitle,
		videoUrl,
		posterImageUrl: toCleanString(value.posterImageUrl),
		aspectRatio,
		style: sanitizeStyleProps(value),
	};
}

function sanitizeAnnouncementBarSection(
	value: Record<string, unknown>,
): HomepageAnnouncementBarSection | null {
	const message = toCleanString(value.message);
	const ctaLabel = toCleanString(value.ctaLabel);
	if (!message && !ctaLabel) return null;
	const scheduleMode = value.scheduleMode === "window" ? "window" : "always";
	return {
		type: "announcement-bar",
		message,
		ctaLabel,
		ctaHref: toCleanString(value.ctaHref),
		scheduleMode,
		scheduleStartIso: toCleanString(value.scheduleStartIso),
		scheduleEndIso: toCleanString(value.scheduleEndIso),
		dismissMode: value.dismissMode === "fixed" ? "fixed" : "dismissible",
		style: sanitizeStyleProps(value),
	};
}

function sanitizeTrustBadgesSection(value: Record<string, unknown>): HomepageTrustBadgesSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const badge1Title = toCleanString(value.badge1Title);
	const badge2Title = toCleanString(value.badge2Title);
	const badge3Title = toCleanString(value.badge3Title);
	const badge4Title = toCleanString(value.badge4Title);
	const badge5Title = toCleanString(value.badge5Title);
	const badge6Title = toCleanString(value.badge6Title);
	if (
		!heading &&
		!subtitle &&
		!badge1Title &&
		!badge2Title &&
		!badge3Title &&
		!badge4Title &&
		!badge5Title &&
		!badge6Title
	)
		return null;
	return {
		type: "trust-badges",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		badge1Icon: toCleanString(value.badge1Icon),
		badge1Title,
		badge1Description: toCleanString(value.badge1Description),
		badge2Icon: toCleanString(value.badge2Icon),
		badge2Title,
		badge2Description: toCleanString(value.badge2Description),
		badge3Icon: toCleanString(value.badge3Icon),
		badge3Title,
		badge3Description: toCleanString(value.badge3Description),
		badge4Icon: toCleanString(value.badge4Icon),
		badge4Title,
		badge4Description: toCleanString(value.badge4Description),
		badge5Icon: toCleanString(value.badge5Icon),
		badge5Title,
		badge5Description: toCleanString(value.badge5Description),
		badge6Icon: toCleanString(value.badge6Icon),
		badge6Title,
		badge6Description: toCleanString(value.badge6Description),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeContactFormLiteSection(
	value: Record<string, unknown>,
): HomepageContactFormLiteSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const submitLabel = toCleanString(value.submitLabel);
	if (!heading && !subtitle && !submitLabel) return null;
	return {
		type: "contact-form-lite",
		heading,
		subtitle,
		namePlaceholder: toCleanString(value.namePlaceholder),
		emailPlaceholder: toCleanString(value.emailPlaceholder),
		messagePlaceholder: toCleanString(value.messagePlaceholder),
		submitLabel,
		actionHref: toCleanString(value.actionHref),
		privacyNote: toCleanString(value.privacyNote),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeTabsContentSection(value: Record<string, unknown>): HomepageTabsContentSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const tab1Label = toCleanString(value.tab1Label);
	const tab2Label = toCleanString(value.tab2Label);
	const tab3Label = toCleanString(value.tab3Label);
	const tab4Label = toCleanString(value.tab4Label);
	if (!heading && !subtitle && !tab1Label && !tab2Label && !tab3Label && !tab4Label) return null;
	const defaultTabRaw =
		typeof value.defaultTab === "number"
			? value.defaultTab
			: Number.parseInt(String(value.defaultTab ?? ""), 10);
	const defaultTab: 1 | 2 | 3 | 4 =
		defaultTabRaw === 2 || defaultTabRaw === 3 || defaultTabRaw === 4 ? defaultTabRaw : 1;
	return {
		type: "tabs-content",
		heading,
		subtitle,
		defaultTab,
		tab1Label,
		tab1Body: toCleanString(value.tab1Body),
		tab2Label,
		tab2Body: toCleanString(value.tab2Body),
		tab3Label,
		tab3Body: toCleanString(value.tab3Body),
		tab4Label,
		tab4Body: toCleanString(value.tab4Body),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeBeforeAfterSection(value: Record<string, unknown>): HomepageBeforeAfterSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const beforeImageUrl = toCleanString(value.beforeImageUrl);
	const afterImageUrl = toCleanString(value.afterImageUrl);
	if (!heading && !subtitle && !beforeImageUrl && !afterImageUrl) return null;
	return {
		type: "before-after",
		heading,
		subtitle,
		layout: value.layout === "vertical" ? "vertical" : "horizontal",
		beforeLabel: toCleanString(value.beforeLabel),
		beforeImageUrl,
		beforeImageAlt: toCleanString(value.beforeImageAlt),
		afterLabel: toCleanString(value.afterLabel),
		afterImageUrl,
		afterImageAlt: toCleanString(value.afterImageAlt),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeSocialProofFeedSection(
	value: Record<string, unknown>,
): HomepageSocialProofFeedSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const item1Quote = toCleanString(value.item1Quote);
	const item2Quote = toCleanString(value.item2Quote);
	const item3Quote = toCleanString(value.item3Quote);
	const item4Quote = toCleanString(value.item4Quote);
	if (!heading && !subtitle && !item1Quote && !item2Quote && !item3Quote && !item4Quote) return null;
	return {
		type: "social-proof-feed",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		item1Quote,
		item1Author: toCleanString(value.item1Author),
		item1Meta: toCleanString(value.item1Meta),
		item1ImageUrl: toCleanString(value.item1ImageUrl),
		item2Quote,
		item2Author: toCleanString(value.item2Author),
		item2Meta: toCleanString(value.item2Meta),
		item2ImageUrl: toCleanString(value.item2ImageUrl),
		item3Quote,
		item3Author: toCleanString(value.item3Author),
		item3Meta: toCleanString(value.item3Meta),
		item3ImageUrl: toCleanString(value.item3ImageUrl),
		item4Quote,
		item4Author: toCleanString(value.item4Author),
		item4Meta: toCleanString(value.item4Meta),
		item4ImageUrl: toCleanString(value.item4ImageUrl),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeFaqCompactSection(value: Record<string, unknown>): HomepageFaqCompactSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const q1 = toCleanString(value.q1);
	const q2 = toCleanString(value.q2);
	const q3 = toCleanString(value.q3);
	const q4 = toCleanString(value.q4);
	const q5 = toCleanString(value.q5);
	const q6 = toCleanString(value.q6);
	if (!heading && !subtitle && !q1 && !q2 && !q3 && !q4 && !q5 && !q6) return null;
	return {
		type: "faq-compact",
		heading,
		subtitle,
		q1,
		a1: toCleanString(value.a1),
		q2,
		a2: toCleanString(value.a2),
		q3,
		a3: toCleanString(value.a3),
		q4,
		a4: toCleanString(value.a4),
		q5,
		a5: toCleanString(value.a5),
		q6,
		a6: toCleanString(value.a6),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeMetricCardsSection(value: Record<string, unknown>): HomepageMetricCardsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const item1Value = toCleanString(value.item1Value);
	const item2Value = toCleanString(value.item2Value);
	const item3Value = toCleanString(value.item3Value);
	const item4Value = toCleanString(value.item4Value);
	const item5Value = toCleanString(value.item5Value);
	const item6Value = toCleanString(value.item6Value);
	if (
		!heading &&
		!subtitle &&
		!item1Value &&
		!item2Value &&
		!item3Value &&
		!item4Value &&
		!item5Value &&
		!item6Value
	)
		return null;
	return {
		type: "metric-cards",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		item1Icon: toCleanString(value.item1Icon),
		item1Label: toCleanString(value.item1Label),
		item1Value,
		item1Delta: toCleanString(value.item1Delta),
		item2Icon: toCleanString(value.item2Icon),
		item2Label: toCleanString(value.item2Label),
		item2Value,
		item2Delta: toCleanString(value.item2Delta),
		item3Icon: toCleanString(value.item3Icon),
		item3Label: toCleanString(value.item3Label),
		item3Value,
		item3Delta: toCleanString(value.item3Delta),
		item4Icon: toCleanString(value.item4Icon),
		item4Label: toCleanString(value.item4Label),
		item4Value,
		item4Delta: toCleanString(value.item4Delta),
		item5Icon: toCleanString(value.item5Icon),
		item5Label: toCleanString(value.item5Label),
		item5Value,
		item5Delta: toCleanString(value.item5Delta),
		item6Icon: toCleanString(value.item6Icon),
		item6Label: toCleanString(value.item6Label),
		item6Value,
		item6Delta: toCleanString(value.item6Delta),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeMediaTextSplitSection(value: Record<string, unknown>): HomepageMediaTextSplitSection | null {
	const heading = toCleanString(value.heading);
	const body = toCleanString(value.body);
	const imageUrl = toCleanString(value.imageUrl);
	const videoUrl = toCleanString(value.videoUrl);
	if (!heading && !body && !imageUrl && !videoUrl) return null;
	return {
		type: "media-text-split",
		eyebrow: toCleanString(value.eyebrow),
		heading,
		body,
		layout: value.layout === "media-right" ? "media-right" : "media-left",
		mediaType: value.mediaType === "video" ? "video" : "image",
		imageUrl,
		imageAlt: toCleanString(value.imageAlt),
		videoUrl,
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeQuoteHighlightSection(value: Record<string, unknown>): HomepageQuoteHighlightSection | null {
	const quoteText = toCleanString(value.quoteText);
	const authorName = toCleanString(value.authorName);
	if (!quoteText && !authorName) return null;
	return {
		type: "quote-highlight",
		quoteText,
		authorName,
		authorTitle: toCleanString(value.authorTitle),
		backgroundImageUrl: toCleanString(value.backgroundImageUrl),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeFeatureComparisonSection(
	value: Record<string, unknown>,
): HomepageFeatureComparisonSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const plan1Name = toCleanString(value.plan1Name);
	const plan2Name = toCleanString(value.plan2Name);
	const row1Label = toCleanString(value.row1Label);
	const row2Label = toCleanString(value.row2Label);
	if (!heading && !subtitle && !plan1Name && !plan2Name && !row1Label && !row2Label) return null;
	return {
		type: "feature-comparison",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		plan1Name,
		plan2Name,
		plan3Name: toCleanString(value.plan3Name),
		plan4Name: toCleanString(value.plan4Name),
		row1Label,
		row1Plan1: toCleanString(value.row1Plan1),
		row1Plan2: toCleanString(value.row1Plan2),
		row1Plan3: toCleanString(value.row1Plan3),
		row1Plan4: toCleanString(value.row1Plan4),
		row2Label,
		row2Plan1: toCleanString(value.row2Plan1),
		row2Plan2: toCleanString(value.row2Plan2),
		row2Plan3: toCleanString(value.row2Plan3),
		row2Plan4: toCleanString(value.row2Plan4),
		row3Label: toCleanString(value.row3Label),
		row3Plan1: toCleanString(value.row3Plan1),
		row3Plan2: toCleanString(value.row3Plan2),
		row3Plan3: toCleanString(value.row3Plan3),
		row3Plan4: toCleanString(value.row3Plan4),
		row4Label: toCleanString(value.row4Label),
		row4Plan1: toCleanString(value.row4Plan1),
		row4Plan2: toCleanString(value.row4Plan2),
		row4Plan3: toCleanString(value.row4Plan3),
		row4Plan4: toCleanString(value.row4Plan4),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeInlineCtaBannerSection(
	value: Record<string, unknown>,
): HomepageInlineCtaBannerSection | null {
	const message = toCleanString(value.message);
	const ctaLabel = toCleanString(value.ctaLabel);
	if (!message && !ctaLabel) return null;
	return {
		type: "inline-cta-banner",
		message,
		ctaLabel,
		ctaHref: toCleanString(value.ctaHref),
		secondaryCtaLabel: toCleanString(value.secondaryCtaLabel),
		secondaryCtaHref: toCleanString(value.secondaryCtaHref),
		compactMode: value.compactMode === "off" ? "off" : "on",
		style: sanitizeStyleProps(value),
	};
}

function sanitizeLogoStripCompactSection(
	value: Record<string, unknown>,
): HomepageLogoStripCompactSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const logo1Url = toCleanString(value.logo1Url);
	const logo2Url = toCleanString(value.logo2Url);
	const logo3Url = toCleanString(value.logo3Url);
	const logo4Url = toCleanString(value.logo4Url);
	const logo5Url = toCleanString(value.logo5Url);
	const logo6Url = toCleanString(value.logo6Url);
	if (!heading && !subtitle && !logo1Url && !logo2Url && !logo3Url && !logo4Url && !logo5Url && !logo6Url)
		return null;
	return {
		type: "logo-strip-compact",
		heading,
		subtitle,
		logo1Url,
		logo1Alt: toCleanString(value.logo1Alt),
		logo1Href: toCleanString(value.logo1Href),
		logo2Url,
		logo2Alt: toCleanString(value.logo2Alt),
		logo2Href: toCleanString(value.logo2Href),
		logo3Url,
		logo3Alt: toCleanString(value.logo3Alt),
		logo3Href: toCleanString(value.logo3Href),
		logo4Url,
		logo4Alt: toCleanString(value.logo4Alt),
		logo4Href: toCleanString(value.logo4Href),
		logo5Url,
		logo5Alt: toCleanString(value.logo5Alt),
		logo5Href: toCleanString(value.logo5Href),
		logo6Url,
		logo6Alt: toCleanString(value.logo6Alt),
		logo6Href: toCleanString(value.logo6Href),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeEventHighlightsSection(
	value: Record<string, unknown>,
): HomepageEventHighlightsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const event1Title = toCleanString(value.event1Title);
	const event2Title = toCleanString(value.event2Title);
	const event3Title = toCleanString(value.event3Title);
	const event4Title = toCleanString(value.event4Title);
	if (!heading && !subtitle && !event1Title && !event2Title && !event3Title && !event4Title) return null;
	return {
		type: "event-highlights",
		heading,
		subtitle,
		layout: value.layout === "cards" ? "cards" : "timeline",
		event1Date: toCleanString(value.event1Date),
		event1Title,
		event1Description: toCleanString(value.event1Description),
		event2Date: toCleanString(value.event2Date),
		event2Title,
		event2Description: toCleanString(value.event2Description),
		event3Date: toCleanString(value.event3Date),
		event3Title,
		event3Description: toCleanString(value.event3Description),
		event4Date: toCleanString(value.event4Date),
		event4Title,
		event4Description: toCleanString(value.event4Description),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeCtaCardPairSection(value: Record<string, unknown>): HomepageCtaCardPairSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const card1Title = toCleanString(value.card1Title);
	const card2Title = toCleanString(value.card2Title);
	if (!heading && !subtitle && !card1Title && !card2Title) return null;
	return {
		type: "cta-card-pair",
		heading,
		subtitle,
		card1Title,
		card1Body: toCleanString(value.card1Body),
		card1CtaLabel: toCleanString(value.card1CtaLabel),
		card1CtaHref: toCleanString(value.card1CtaHref),
		card1ImageUrl: toCleanString(value.card1ImageUrl),
		card2Title,
		card2Body: toCleanString(value.card2Body),
		card2CtaLabel: toCleanString(value.card2CtaLabel),
		card2CtaHref: toCleanString(value.card2CtaHref),
		card2ImageUrl: toCleanString(value.card2ImageUrl),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeFaqWithCtaSection(value: Record<string, unknown>): HomepageFaqWithCtaSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const q1 = toCleanString(value.q1);
	const a1 = toCleanString(value.a1);
	const q2 = toCleanString(value.q2);
	const a2 = toCleanString(value.a2);
	const q3 = toCleanString(value.q3);
	const a3 = toCleanString(value.a3);
	const q4 = toCleanString(value.q4);
	const a4 = toCleanString(value.a4);
	const ctaTitle = toCleanString(value.ctaTitle);
	const ctaBody = toCleanString(value.ctaBody);
	const ctaLabel = toCleanString(value.ctaLabel);
	if (
		!heading &&
		!subtitle &&
		!q1 &&
		!a1 &&
		!q2 &&
		!a2 &&
		!q3 &&
		!a3 &&
		!q4 &&
		!a4 &&
		!ctaTitle &&
		!ctaBody &&
		!ctaLabel
	)
		return null;
	return {
		type: "faq-with-cta",
		heading,
		subtitle,
		q1,
		a1,
		q2,
		a2,
		q3,
		a3,
		q4,
		a4,
		ctaTitle,
		ctaBody,
		ctaLabel,
		ctaHref: toCleanString(value.ctaHref),
		ctaImageUrl: toCleanString(value.ctaImageUrl),
		style: sanitizeStyleProps(value),
	};
}

function sanitizePartnerMetricsSection(value: Record<string, unknown>): HomepagePartnerMetricsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const item1Metric = toCleanString(value.item1Metric);
	const item1Label = toCleanString(value.item1Label);
	const item2Metric = toCleanString(value.item2Metric);
	const item2Label = toCleanString(value.item2Label);
	const item3Metric = toCleanString(value.item3Metric);
	const item3Label = toCleanString(value.item3Label);
	const item4Metric = toCleanString(value.item4Metric);
	const item4Label = toCleanString(value.item4Label);
	if (
		!heading &&
		!subtitle &&
		!item1Metric &&
		!item1Label &&
		!item2Metric &&
		!item2Label &&
		!item3Metric &&
		!item3Label &&
		!item4Metric &&
		!item4Label
	)
		return null;
	return {
		type: "partner-metrics",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		item1LogoUrl: toCleanString(value.item1LogoUrl),
		item1LogoAlt: toCleanString(value.item1LogoAlt),
		item1Metric,
		item1Label,
		item2LogoUrl: toCleanString(value.item2LogoUrl),
		item2LogoAlt: toCleanString(value.item2LogoAlt),
		item2Metric,
		item2Label,
		item3LogoUrl: toCleanString(value.item3LogoUrl),
		item3LogoAlt: toCleanString(value.item3LogoAlt),
		item3Metric,
		item3Label,
		item4LogoUrl: toCleanString(value.item4LogoUrl),
		item4LogoAlt: toCleanString(value.item4LogoAlt),
		item4Metric,
		item4Label,
		style: sanitizeStyleProps(value),
	};
}

function sanitizeStoryStepsSection(value: Record<string, unknown>): HomepageStoryStepsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const step1Title = toCleanString(value.step1Title);
	const step1Body = toCleanString(value.step1Body);
	const step2Title = toCleanString(value.step2Title);
	const step2Body = toCleanString(value.step2Body);
	const step3Title = toCleanString(value.step3Title);
	const step3Body = toCleanString(value.step3Body);
	const step4Title = toCleanString(value.step4Title);
	const step4Body = toCleanString(value.step4Body);
	if (
		!heading &&
		!subtitle &&
		!step1Title &&
		!step1Body &&
		!step2Title &&
		!step2Body &&
		!step3Title &&
		!step3Body &&
		!step4Title &&
		!step4Body
	)
		return null;
	return {
		type: "story-steps",
		heading,
		subtitle,
		layout: value.layout === "timeline" ? "timeline" : "cards",
		step1Title,
		step1Body,
		step1ImageUrl: toCleanString(value.step1ImageUrl),
		step2Title,
		step2Body,
		step2ImageUrl: toCleanString(value.step2ImageUrl),
		step3Title,
		step3Body,
		step3ImageUrl: toCleanString(value.step3ImageUrl),
		step4Title,
		step4Body,
		step4ImageUrl: toCleanString(value.step4ImageUrl),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeMediaCarouselSection(value: Record<string, unknown>): HomepageMediaCarouselSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const slide1ImageUrl = toCleanString(value.slide1ImageUrl);
	const slide1Title = toCleanString(value.slide1Title);
	const slide1Body = toCleanString(value.slide1Body);
	const slide1CtaLabel = toCleanString(value.slide1CtaLabel);
	const slide2ImageUrl = toCleanString(value.slide2ImageUrl);
	const slide2Title = toCleanString(value.slide2Title);
	const slide2Body = toCleanString(value.slide2Body);
	const slide2CtaLabel = toCleanString(value.slide2CtaLabel);
	const slide3ImageUrl = toCleanString(value.slide3ImageUrl);
	const slide3Title = toCleanString(value.slide3Title);
	const slide3Body = toCleanString(value.slide3Body);
	const slide3CtaLabel = toCleanString(value.slide3CtaLabel);
	if (
		!heading &&
		!subtitle &&
		!slide1ImageUrl &&
		!slide1Title &&
		!slide1Body &&
		!slide1CtaLabel &&
		!slide2ImageUrl &&
		!slide2Title &&
		!slide2Body &&
		!slide2CtaLabel &&
		!slide3ImageUrl &&
		!slide3Title &&
		!slide3Body &&
		!slide3CtaLabel
	)
		return null;
	return {
		type: "media-carousel",
		heading,
		subtitle,
		autoplay: value.autoplay === "off" ? "off" : "on",
		slide1ImageUrl,
		slide1Title,
		slide1Body,
		slide1CtaLabel,
		slide1CtaHref: toCleanString(value.slide1CtaHref),
		slide2ImageUrl,
		slide2Title,
		slide2Body,
		slide2CtaLabel,
		slide2CtaHref: toCleanString(value.slide2CtaHref),
		slide3ImageUrl,
		slide3Title,
		slide3Body,
		slide3CtaLabel,
		slide3CtaHref: toCleanString(value.slide3CtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeFeatureChecklistSection(
	value: Record<string, unknown>,
): HomepageFeatureChecklistSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const item1 = toCleanString(value.item1);
	const item2 = toCleanString(value.item2);
	const item3 = toCleanString(value.item3);
	const item4 = toCleanString(value.item4);
	const item5 = toCleanString(value.item5);
	const item6 = toCleanString(value.item6);
	const item7 = toCleanString(value.item7);
	const item8 = toCleanString(value.item8);
	const ctaLabel = toCleanString(value.ctaLabel);
	if (
		!heading &&
		!subtitle &&
		!item1 &&
		!item2 &&
		!item3 &&
		!item4 &&
		!item5 &&
		!item6 &&
		!item7 &&
		!item8 &&
		!ctaLabel
	)
		return null;
	return {
		type: "feature-checklist",
		heading,
		subtitle,
		item1,
		item2,
		item3,
		item4,
		item5,
		item6,
		item7,
		item8,
		ctaLabel,
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeMiniBlogCardsSection(value: Record<string, unknown>): HomepageMiniBlogCardsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const card1Title = toCleanString(value.card1Title);
	const card1Excerpt = toCleanString(value.card1Excerpt);
	const card2Title = toCleanString(value.card2Title);
	const card2Excerpt = toCleanString(value.card2Excerpt);
	const card3Title = toCleanString(value.card3Title);
	const card3Excerpt = toCleanString(value.card3Excerpt);
	if (
		!heading &&
		!subtitle &&
		!card1Title &&
		!card1Excerpt &&
		!card2Title &&
		!card2Excerpt &&
		!card3Title &&
		!card3Excerpt
	)
		return null;
	return {
		type: "mini-blog-cards",
		heading,
		subtitle,
		card1Title,
		card1Excerpt,
		card1Href: toCleanString(value.card1Href),
		card1ImageUrl: toCleanString(value.card1ImageUrl),
		card2Title,
		card2Excerpt,
		card2Href: toCleanString(value.card2Href),
		card2ImageUrl: toCleanString(value.card2ImageUrl),
		card3Title,
		card3Excerpt,
		card3Href: toCleanString(value.card3Href),
		card3ImageUrl: toCleanString(value.card3ImageUrl),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeTrustLogoWallSection(value: Record<string, unknown>): HomepageTrustLogoWallSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const groupLabel = toCleanString(value.groupLabel);
	const logo1Url = toCleanString(value.logo1Url);
	const logo2Url = toCleanString(value.logo2Url);
	const logo3Url = toCleanString(value.logo3Url);
	const logo4Url = toCleanString(value.logo4Url);
	const logo5Url = toCleanString(value.logo5Url);
	const logo6Url = toCleanString(value.logo6Url);
	const logo7Url = toCleanString(value.logo7Url);
	const logo8Url = toCleanString(value.logo8Url);
	if (
		!heading &&
		!subtitle &&
		!groupLabel &&
		!logo1Url &&
		!logo2Url &&
		!logo3Url &&
		!logo4Url &&
		!logo5Url &&
		!logo6Url &&
		!logo7Url &&
		!logo8Url
	)
		return null;
	return {
		type: "trust-logo-wall",
		heading,
		subtitle,
		groupLabel,
		density: value.density === "normal" ? "normal" : "dense",
		logo1Url,
		logo1Alt: toCleanString(value.logo1Alt),
		logo1Href: toCleanString(value.logo1Href),
		logo2Url,
		logo2Alt: toCleanString(value.logo2Alt),
		logo2Href: toCleanString(value.logo2Href),
		logo3Url,
		logo3Alt: toCleanString(value.logo3Alt),
		logo3Href: toCleanString(value.logo3Href),
		logo4Url,
		logo4Alt: toCleanString(value.logo4Alt),
		logo4Href: toCleanString(value.logo4Href),
		logo5Url,
		logo5Alt: toCleanString(value.logo5Alt),
		logo5Href: toCleanString(value.logo5Href),
		logo6Url,
		logo6Alt: toCleanString(value.logo6Alt),
		logo6Href: toCleanString(value.logo6Href),
		logo7Url,
		logo7Alt: toCleanString(value.logo7Alt),
		logo7Href: toCleanString(value.logo7Href),
		logo8Url,
		logo8Alt: toCleanString(value.logo8Alt),
		logo8Href: toCleanString(value.logo8Href),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeDualHeroSplitSection(value: Record<string, unknown>): HomepageDualHeroSplitSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const leftTitle = toCleanString(value.leftTitle);
	const rightTitle = toCleanString(value.rightTitle);
	const leftBody = toCleanString(value.leftBody);
	const rightBody = toCleanString(value.rightBody);
	if (!heading && !subtitle && !leftTitle && !rightTitle && !leftBody && !rightBody) return null;
	return {
		type: "dual-hero-split",
		heading,
		subtitle,
		leftEyebrow: toCleanString(value.leftEyebrow),
		leftTitle,
		leftBody,
		leftCtaLabel: toCleanString(value.leftCtaLabel),
		leftCtaHref: toCleanString(value.leftCtaHref),
		leftImageUrl: toCleanString(value.leftImageUrl),
		leftBackgroundColor: toCleanString(value.leftBackgroundColor),
		rightEyebrow: toCleanString(value.rightEyebrow),
		rightTitle,
		rightBody,
		rightCtaLabel: toCleanString(value.rightCtaLabel),
		rightCtaHref: toCleanString(value.rightCtaHref),
		rightImageUrl: toCleanString(value.rightImageUrl),
		rightBackgroundColor: toCleanString(value.rightBackgroundColor),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeQuickLinksGridSection(value: Record<string, unknown>): HomepageQuickLinksGridSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const link1Label = toCleanString(value.link1Label);
	const link2Label = toCleanString(value.link2Label);
	const link3Label = toCleanString(value.link3Label);
	const link4Label = toCleanString(value.link4Label);
	const link5Label = toCleanString(value.link5Label);
	const link6Label = toCleanString(value.link6Label);
	const link7Label = toCleanString(value.link7Label);
	const link8Label = toCleanString(value.link8Label);
	if (
		!heading &&
		!subtitle &&
		!link1Label &&
		!link2Label &&
		!link3Label &&
		!link4Label &&
		!link5Label &&
		!link6Label &&
		!link7Label &&
		!link8Label
	)
		return null;
	return {
		type: "quick-links-grid",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		link1Label,
		link1Href: toCleanString(value.link1Href),
		link1Icon: toCleanString(value.link1Icon),
		link2Label,
		link2Href: toCleanString(value.link2Href),
		link2Icon: toCleanString(value.link2Icon),
		link3Label,
		link3Href: toCleanString(value.link3Href),
		link3Icon: toCleanString(value.link3Icon),
		link4Label,
		link4Href: toCleanString(value.link4Href),
		link4Icon: toCleanString(value.link4Icon),
		link5Label,
		link5Href: toCleanString(value.link5Href),
		link5Icon: toCleanString(value.link5Icon),
		link6Label,
		link6Href: toCleanString(value.link6Href),
		link6Icon: toCleanString(value.link6Icon),
		link7Label,
		link7Href: toCleanString(value.link7Href),
		link7Icon: toCleanString(value.link7Icon),
		link8Label,
		link8Href: toCleanString(value.link8Href),
		link8Icon: toCleanString(value.link8Icon),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeStoreLocatorLiteSection(
	value: Record<string, unknown>,
): HomepageStoreLocatorLiteSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const card1Name = toCleanString(value.card1Name);
	const card1Address = toCleanString(value.card1Address);
	const card2Name = toCleanString(value.card2Name);
	const card2Address = toCleanString(value.card2Address);
	const card3Name = toCleanString(value.card3Name);
	const card3Address = toCleanString(value.card3Address);
	if (
		!heading &&
		!subtitle &&
		!card1Name &&
		!card1Address &&
		!card2Name &&
		!card2Address &&
		!card3Name &&
		!card3Address
	)
		return null;
	return {
		type: "store-locator-lite",
		heading,
		subtitle,
		card1Name,
		card1Address,
		card1Phone: toCleanString(value.card1Phone),
		card1Hours: toCleanString(value.card1Hours),
		card1MapHref: toCleanString(value.card1MapHref),
		card2Name,
		card2Address,
		card2Phone: toCleanString(value.card2Phone),
		card2Hours: toCleanString(value.card2Hours),
		card2MapHref: toCleanString(value.card2MapHref),
		card3Name,
		card3Address,
		card3Phone: toCleanString(value.card3Phone),
		card3Hours: toCleanString(value.card3Hours),
		card3MapHref: toCleanString(value.card3MapHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeTimelineCompactSection(
	value: Record<string, unknown>,
): HomepageTimelineCompactSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const item1Title = toCleanString(value.item1Title);
	const item2Title = toCleanString(value.item2Title);
	const item3Title = toCleanString(value.item3Title);
	const item4Title = toCleanString(value.item4Title);
	if (!heading && !subtitle && !item1Title && !item2Title && !item3Title && !item4Title) return null;
	return {
		type: "timeline-compact",
		heading,
		subtitle,
		item1Date: toCleanString(value.item1Date),
		item1Title,
		item1Body: toCleanString(value.item1Body),
		item2Date: toCleanString(value.item2Date),
		item2Title,
		item2Body: toCleanString(value.item2Body),
		item3Date: toCleanString(value.item3Date),
		item3Title,
		item3Body: toCleanString(value.item3Body),
		item4Date: toCleanString(value.item4Date),
		item4Title,
		item4Body: toCleanString(value.item4Body),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeFaqCardsSection(value: Record<string, unknown>): HomepageFaqCardsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const q1 = toCleanString(value.q1);
	const a1 = toCleanString(value.a1);
	const q2 = toCleanString(value.q2);
	const a2 = toCleanString(value.a2);
	const q3 = toCleanString(value.q3);
	const a3 = toCleanString(value.a3);
	const q4 = toCleanString(value.q4);
	const a4 = toCleanString(value.a4);
	const q5 = toCleanString(value.q5);
	const a5 = toCleanString(value.a5);
	const q6 = toCleanString(value.q6);
	const a6 = toCleanString(value.a6);
	if (
		!heading &&
		!subtitle &&
		!q1 &&
		!a1 &&
		!q2 &&
		!a2 &&
		!q3 &&
		!a3 &&
		!q4 &&
		!a4 &&
		!q5 &&
		!a5 &&
		!q6 &&
		!a6
	)
		return null;
	return {
		type: "faq-cards",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		q1,
		a1,
		q2,
		a2,
		q3,
		a3,
		q4,
		a4,
		q5,
		a5,
		q6,
		a6,
		style: sanitizeStyleProps(value),
	};
}

function sanitizeProductComparisonLiteSection(
	value: Record<string, unknown>,
): HomepageProductComparisonLiteSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const item1Name = toCleanString(value.item1Name);
	const item2Name = toCleanString(value.item2Name);
	const item3Name = toCleanString(value.item3Name);
	const item4Name = toCleanString(value.item4Name);
	if (!heading && !subtitle && !item1Name && !item2Name && !item3Name && !item4Name) return null;
	return {
		type: "product-comparison-lite",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		item1Name,
		item1Price: toCleanString(value.item1Price),
		item1Feature: toCleanString(value.item1Feature),
		item1CtaLabel: toCleanString(value.item1CtaLabel),
		item1CtaHref: toCleanString(value.item1CtaHref),
		item2Name,
		item2Price: toCleanString(value.item2Price),
		item2Feature: toCleanString(value.item2Feature),
		item2CtaLabel: toCleanString(value.item2CtaLabel),
		item2CtaHref: toCleanString(value.item2CtaHref),
		item3Name,
		item3Price: toCleanString(value.item3Price),
		item3Feature: toCleanString(value.item3Feature),
		item3CtaLabel: toCleanString(value.item3CtaLabel),
		item3CtaHref: toCleanString(value.item3CtaHref),
		item4Name,
		item4Price: toCleanString(value.item4Price),
		item4Feature: toCleanString(value.item4Feature),
		item4CtaLabel: toCleanString(value.item4CtaLabel),
		item4CtaHref: toCleanString(value.item4CtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeCtaMarqueeSection(value: Record<string, unknown>): HomepageCtaMarqueeSection | null {
	const message = toCleanString(value.message);
	const secondaryMessage = toCleanString(value.secondaryMessage);
	const ctaLabel = toCleanString(value.ctaLabel);
	if (!message && !secondaryMessage && !ctaLabel) return null;
	return {
		type: "cta-marquee",
		message,
		secondaryMessage,
		ctaLabel,
		ctaHref: toCleanString(value.ctaHref),
		speed: value.speed === "slow" || value.speed === "fast" ? value.speed : "normal",
		pauseOnHover: value.pauseOnHover === "off" ? "off" : "on",
		style: sanitizeStyleProps(value),
	};
}

function sanitizeFaqAccordionPlusSection(
	value: Record<string, unknown>,
): HomepageFaqAccordionPlusSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const q1 = toCleanString(value.q1);
	const a1 = toCleanString(value.a1);
	const q2 = toCleanString(value.q2);
	const a2 = toCleanString(value.a2);
	const q3 = toCleanString(value.q3);
	const a3 = toCleanString(value.a3);
	const q4 = toCleanString(value.q4);
	const a4 = toCleanString(value.a4);
	const q5 = toCleanString(value.q5);
	const a5 = toCleanString(value.a5);
	const q6 = toCleanString(value.q6);
	const a6 = toCleanString(value.a6);
	if (
		!heading &&
		!subtitle &&
		!q1 &&
		!a1 &&
		!q2 &&
		!a2 &&
		!q3 &&
		!a3 &&
		!q4 &&
		!a4 &&
		!q5 &&
		!a5 &&
		!q6 &&
		!a6
	)
		return null;
	return {
		type: "faq-accordion-plus",
		heading,
		subtitle,
		group1Title: toCleanString(value.group1Title),
		q1,
		a1,
		q2,
		a2,
		group2Title: toCleanString(value.group2Title),
		q3,
		a3,
		q4,
		a4,
		group3Title: toCleanString(value.group3Title),
		q5,
		a5,
		q6,
		a6,
		style: sanitizeStyleProps(value),
	};
}

function sanitizeUspPillRowSection(value: Record<string, unknown>): HomepageUspPillRowSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const item1Label = toCleanString(value.item1Label);
	const item2Label = toCleanString(value.item2Label);
	const item3Label = toCleanString(value.item3Label);
	const item4Label = toCleanString(value.item4Label);
	const item5Label = toCleanString(value.item5Label);
	const item6Label = toCleanString(value.item6Label);
	if (
		!heading &&
		!subtitle &&
		!item1Label &&
		!item2Label &&
		!item3Label &&
		!item4Label &&
		!item5Label &&
		!item6Label
	)
		return null;
	return {
		type: "usp-pill-row",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		item1Icon: toCleanString(value.item1Icon),
		item1Label,
		item2Icon: toCleanString(value.item2Icon),
		item2Label,
		item3Icon: toCleanString(value.item3Icon),
		item3Label,
		item4Icon: toCleanString(value.item4Icon),
		item4Label,
		item5Icon: toCleanString(value.item5Icon),
		item5Label,
		item6Icon: toCleanString(value.item6Icon),
		item6Label,
		style: sanitizeStyleProps(value),
	};
}

function sanitizePricingCardLiteSection(
	value: Record<string, unknown>,
): HomepagePricingCardLiteSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const plan1Name = toCleanString(value.plan1Name);
	const plan2Name = toCleanString(value.plan2Name);
	const plan3Name = toCleanString(value.plan3Name);
	const plan4Name = toCleanString(value.plan4Name);
	if (!heading && !subtitle && !plan1Name && !plan2Name && !plan3Name && !plan4Name) return null;
	return {
		type: "pricing-card-lite",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		plan1Name,
		plan1Price: toCleanString(value.plan1Price),
		plan1Feature: toCleanString(value.plan1Feature),
		plan1CtaLabel: toCleanString(value.plan1CtaLabel),
		plan1CtaHref: toCleanString(value.plan1CtaHref),
		plan2Name,
		plan2Price: toCleanString(value.plan2Price),
		plan2Feature: toCleanString(value.plan2Feature),
		plan2CtaLabel: toCleanString(value.plan2CtaLabel),
		plan2CtaHref: toCleanString(value.plan2CtaHref),
		plan3Name,
		plan3Price: toCleanString(value.plan3Price),
		plan3Feature: toCleanString(value.plan3Feature),
		plan3CtaLabel: toCleanString(value.plan3CtaLabel),
		plan3CtaHref: toCleanString(value.plan3CtaHref),
		plan4Name,
		plan4Price: toCleanString(value.plan4Price),
		plan4Feature: toCleanString(value.plan4Feature),
		plan4CtaLabel: toCleanString(value.plan4CtaLabel),
		plan4CtaHref: toCleanString(value.plan4CtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeBrandStoryTimelineSection(
	value: Record<string, unknown>,
): HomepageBrandStoryTimelineSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const milestone1Title = toCleanString(value.milestone1Title);
	const milestone2Title = toCleanString(value.milestone2Title);
	const milestone3Title = toCleanString(value.milestone3Title);
	const milestone4Title = toCleanString(value.milestone4Title);
	if (!heading && !subtitle && !milestone1Title && !milestone2Title && !milestone3Title && !milestone4Title)
		return null;
	return {
		type: "brand-story-timeline",
		heading,
		subtitle,
		milestone1Date: toCleanString(value.milestone1Date),
		milestone1Title,
		milestone1Body: toCleanString(value.milestone1Body),
		milestone1ImageUrl: toCleanString(value.milestone1ImageUrl),
		milestone2Date: toCleanString(value.milestone2Date),
		milestone2Title,
		milestone2Body: toCleanString(value.milestone2Body),
		milestone2ImageUrl: toCleanString(value.milestone2ImageUrl),
		milestone3Date: toCleanString(value.milestone3Date),
		milestone3Title,
		milestone3Body: toCleanString(value.milestone3Body),
		milestone3ImageUrl: toCleanString(value.milestone3ImageUrl),
		milestone4Date: toCleanString(value.milestone4Date),
		milestone4Title,
		milestone4Body: toCleanString(value.milestone4Body),
		milestone4ImageUrl: toCleanString(value.milestone4ImageUrl),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeSocialLinksBarSection(value: Record<string, unknown>): HomepageSocialLinksBarSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const link1Label = toCleanString(value.link1Label);
	const link2Label = toCleanString(value.link2Label);
	const link3Label = toCleanString(value.link3Label);
	const link4Label = toCleanString(value.link4Label);
	const link5Label = toCleanString(value.link5Label);
	const link6Label = toCleanString(value.link6Label);
	if (
		!heading &&
		!subtitle &&
		!link1Label &&
		!link2Label &&
		!link3Label &&
		!link4Label &&
		!link5Label &&
		!link6Label
	)
		return null;
	return {
		type: "social-links-bar",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		link1Label,
		link1Href: toCleanString(value.link1Href),
		link1Icon: toCleanString(value.link1Icon),
		link2Label,
		link2Href: toCleanString(value.link2Href),
		link2Icon: toCleanString(value.link2Icon),
		link3Label,
		link3Href: toCleanString(value.link3Href),
		link3Icon: toCleanString(value.link3Icon),
		link4Label,
		link4Href: toCleanString(value.link4Href),
		link4Icon: toCleanString(value.link4Icon),
		link5Label,
		link5Href: toCleanString(value.link5Href),
		link5Icon: toCleanString(value.link5Icon),
		link6Label,
		link6Href: toCleanString(value.link6Href),
		link6Icon: toCleanString(value.link6Icon),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeFeatureTableLiteSection(
	value: Record<string, unknown>,
): HomepageFeatureTableLiteSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const col1Name = toCleanString(value.col1Name);
	const col2Name = toCleanString(value.col2Name);
	const col3Name = toCleanString(value.col3Name);
	const col4Name = toCleanString(value.col4Name);
	const row1Label = toCleanString(value.row1Label);
	const row2Label = toCleanString(value.row2Label);
	const row3Label = toCleanString(value.row3Label);
	const row4Label = toCleanString(value.row4Label);
	if (
		!heading &&
		!subtitle &&
		!col1Name &&
		!col2Name &&
		!col3Name &&
		!col4Name &&
		!row1Label &&
		!row2Label &&
		!row3Label &&
		!row4Label
	)
		return null;
	return {
		type: "feature-table-lite",
		heading,
		subtitle,
		col1Name,
		col2Name,
		col3Name,
		col4Name,
		row1Label,
		row1Col1: toCleanString(value.row1Col1),
		row1Col2: toCleanString(value.row1Col2),
		row1Col3: toCleanString(value.row1Col3),
		row1Col4: toCleanString(value.row1Col4),
		row2Label,
		row2Col1: toCleanString(value.row2Col1),
		row2Col2: toCleanString(value.row2Col2),
		row2Col3: toCleanString(value.row2Col3),
		row2Col4: toCleanString(value.row2Col4),
		row3Label,
		row3Col1: toCleanString(value.row3Col1),
		row3Col2: toCleanString(value.row3Col2),
		row3Col3: toCleanString(value.row3Col3),
		row3Col4: toCleanString(value.row3Col4),
		row4Label,
		row4Col1: toCleanString(value.row4Col1),
		row4Col2: toCleanString(value.row4Col2),
		row4Col3: toCleanString(value.row4Col3),
		row4Col4: toCleanString(value.row4Col4),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeTeamIntroCardsSection(value: Record<string, unknown>): HomepageTeamIntroCardsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const member1Name = toCleanString(value.member1Name);
	const member2Name = toCleanString(value.member2Name);
	const member3Name = toCleanString(value.member3Name);
	const member4Name = toCleanString(value.member4Name);
	if (!heading && !subtitle && !member1Name && !member2Name && !member3Name && !member4Name) return null;
	return {
		type: "team-intro-cards",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		member1Name,
		member1Role: toCleanString(value.member1Role),
		member1Bio: toCleanString(value.member1Bio),
		member1ImageUrl: toCleanString(value.member1ImageUrl),
		member1ProfileHref: toCleanString(value.member1ProfileHref),
		member2Name,
		member2Role: toCleanString(value.member2Role),
		member2Bio: toCleanString(value.member2Bio),
		member2ImageUrl: toCleanString(value.member2ImageUrl),
		member2ProfileHref: toCleanString(value.member2ProfileHref),
		member3Name,
		member3Role: toCleanString(value.member3Role),
		member3Bio: toCleanString(value.member3Bio),
		member3ImageUrl: toCleanString(value.member3ImageUrl),
		member3ProfileHref: toCleanString(value.member3ProfileHref),
		member4Name,
		member4Role: toCleanString(value.member4Role),
		member4Bio: toCleanString(value.member4Bio),
		member4ImageUrl: toCleanString(value.member4ImageUrl),
		member4ProfileHref: toCleanString(value.member4ProfileHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeLogoWithCtaStripSection(
	value: Record<string, unknown>,
): HomepageLogoWithCtaStripSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const logoText = toCleanString(value.logoText);
	const ctaLabel = toCleanString(value.ctaLabel);
	if (!heading && !subtitle && !logoText && !ctaLabel) return null;
	return {
		type: "logo-with-cta-strip",
		heading,
		subtitle,
		logoText,
		logoImageUrl: toCleanString(value.logoImageUrl),
		ctaLabel,
		ctaHref: toCleanString(value.ctaHref),
		secondaryCtaLabel: toCleanString(value.secondaryCtaLabel),
		secondaryCtaHref: toCleanString(value.secondaryCtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeTestimonialMarqueeLiteSection(
	value: Record<string, unknown>,
): HomepageTestimonialMarqueeLiteSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const item1Quote = toCleanString(value.item1Quote);
	const item2Quote = toCleanString(value.item2Quote);
	const item3Quote = toCleanString(value.item3Quote);
	const item4Quote = toCleanString(value.item4Quote);
	const item5Quote = toCleanString(value.item5Quote);
	const item6Quote = toCleanString(value.item6Quote);
	if (
		!heading &&
		!subtitle &&
		!item1Quote &&
		!item2Quote &&
		!item3Quote &&
		!item4Quote &&
		!item5Quote &&
		!item6Quote
	)
		return null;
	return {
		type: "testimonial-marquee-lite",
		heading,
		subtitle,
		speed: value.speed === "slow" || value.speed === "fast" ? value.speed : "normal",
		pauseOnHover: value.pauseOnHover === "off" ? "off" : "on",
		item1Quote,
		item1Author: toCleanString(value.item1Author),
		item2Quote,
		item2Author: toCleanString(value.item2Author),
		item3Quote,
		item3Author: toCleanString(value.item3Author),
		item4Quote,
		item4Author: toCleanString(value.item4Author),
		item5Quote,
		item5Author: toCleanString(value.item5Author),
		item6Quote,
		item6Author: toCleanString(value.item6Author),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeFeatureIconTableSection(
	value: Record<string, unknown>,
): HomepageFeatureIconTableSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const col1Name = toCleanString(value.col1Name);
	const col2Name = toCleanString(value.col2Name);
	const col3Name = toCleanString(value.col3Name);
	const col4Name = toCleanString(value.col4Name);
	const row1Label = toCleanString(value.row1Label);
	const row2Label = toCleanString(value.row2Label);
	const row3Label = toCleanString(value.row3Label);
	const row4Label = toCleanString(value.row4Label);
	if (
		!heading &&
		!subtitle &&
		!col1Name &&
		!col2Name &&
		!col3Name &&
		!col4Name &&
		!row1Label &&
		!row2Label &&
		!row3Label &&
		!row4Label
	)
		return null;
	return {
		type: "feature-icon-table",
		heading,
		subtitle,
		col1Name,
		col2Name,
		col3Name,
		col4Name,
		row1Icon: toCleanString(value.row1Icon),
		row1Label,
		row1Col1: toCleanString(value.row1Col1),
		row1Col2: toCleanString(value.row1Col2),
		row1Col3: toCleanString(value.row1Col3),
		row1Col4: toCleanString(value.row1Col4),
		row2Icon: toCleanString(value.row2Icon),
		row2Label,
		row2Col1: toCleanString(value.row2Col1),
		row2Col2: toCleanString(value.row2Col2),
		row2Col3: toCleanString(value.row2Col3),
		row2Col4: toCleanString(value.row2Col4),
		row3Icon: toCleanString(value.row3Icon),
		row3Label,
		row3Col1: toCleanString(value.row3Col1),
		row3Col2: toCleanString(value.row3Col2),
		row3Col3: toCleanString(value.row3Col3),
		row3Col4: toCleanString(value.row3Col4),
		row4Icon: toCleanString(value.row4Icon),
		row4Label,
		row4Col1: toCleanString(value.row4Col1),
		row4Col2: toCleanString(value.row4Col2),
		row4Col3: toCleanString(value.row4Col3),
		row4Col4: toCleanString(value.row4Col4),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeFaqTwoColumnSection(value: Record<string, unknown>): HomepageFaqTwoColumnSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const q1Question = toCleanString(value.q1Question);
	const q2Question = toCleanString(value.q2Question);
	const q3Question = toCleanString(value.q3Question);
	const q4Question = toCleanString(value.q4Question);
	const helpTitle = toCleanString(value.helpTitle);
	if (!heading && !subtitle && !q1Question && !q2Question && !q3Question && !q4Question && !helpTitle)
		return null;
	return {
		type: "faq-two-column",
		heading,
		subtitle,
		q1Question,
		q1Answer: toCleanString(value.q1Answer),
		q2Question,
		q2Answer: toCleanString(value.q2Answer),
		q3Question,
		q3Answer: toCleanString(value.q3Answer),
		q4Question,
		q4Answer: toCleanString(value.q4Answer),
		helpTitle,
		helpBody: toCleanString(value.helpBody),
		helpCtaLabel: toCleanString(value.helpCtaLabel),
		helpCtaHref: toCleanString(value.helpCtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeProductBundleLiteSection(
	value: Record<string, unknown>,
): HomepageProductBundleLiteSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const bundleName = toCleanString(value.bundleName);
	const bundleItems = toCleanString(value.bundleItems);
	const ctaLabel = toCleanString(value.ctaLabel);
	if (!heading && !subtitle && !bundleName && !bundleItems && !ctaLabel) return null;
	return {
		type: "product-bundle-lite",
		heading,
		subtitle,
		bundleName,
		bundleItems,
		bundlePrice: toCleanString(value.bundlePrice),
		bundleCompareAt: toCleanString(value.bundleCompareAt),
		ctaLabel,
		ctaHref: toCleanString(value.ctaHref),
		note: toCleanString(value.note),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeAnnouncementStackSection(
	value: Record<string, unknown>,
): HomepageAnnouncementStackSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const item1Title = toCleanString(value.item1Title);
	const item2Title = toCleanString(value.item2Title);
	const item3Title = toCleanString(value.item3Title);
	const item4Title = toCleanString(value.item4Title);
	if (!heading && !subtitle && !item1Title && !item2Title && !item3Title && !item4Title) return null;
	const normalizeLevel = (raw: unknown): "info" | "success" | "warning" | "error" => {
		if (raw === "success" || raw === "warning" || raw === "error") return raw;
		return "info";
	};
	return {
		type: "announcement-stack",
		heading,
		subtitle,
		item1Level: normalizeLevel(value.item1Level),
		item1Title,
		item1Body: toCleanString(value.item1Body),
		item2Level: normalizeLevel(value.item2Level),
		item2Title,
		item2Body: toCleanString(value.item2Body),
		item3Level: normalizeLevel(value.item3Level),
		item3Title,
		item3Body: toCleanString(value.item3Body),
		item4Level: normalizeLevel(value.item4Level),
		item4Title,
		item4Body: toCleanString(value.item4Body),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeProductFeatureTabsSection(
	value: Record<string, unknown>,
): HomepageProductFeatureTabsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const tab1Title = toCleanString(value.tab1Title);
	const tab2Title = toCleanString(value.tab2Title);
	const tab3Title = toCleanString(value.tab3Title);
	const tab4Title = toCleanString(value.tab4Title);
	if (!heading && !subtitle && !tab1Title && !tab2Title && !tab3Title && !tab4Title) return null;
	return {
		type: "product-feature-tabs",
		heading,
		subtitle,
		tab1Title,
		tab1Body: toCleanString(value.tab1Body),
		tab2Title,
		tab2Body: toCleanString(value.tab2Body),
		tab3Title,
		tab3Body: toCleanString(value.tab3Body),
		tab4Title,
		tab4Body: toCleanString(value.tab4Body),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeBenefitCardsGridSection(
	value: Record<string, unknown>,
): HomepageBenefitCardsGridSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const card1Title = toCleanString(value.card1Title);
	const card2Title = toCleanString(value.card2Title);
	const card3Title = toCleanString(value.card3Title);
	const card4Title = toCleanString(value.card4Title);
	if (!heading && !subtitle && !card1Title && !card2Title && !card3Title && !card4Title) return null;
	return {
		type: "benefit-cards-grid",
		heading,
		subtitle,
		columns: normalizeColumns(value.columns),
		card1Icon: toCleanString(value.card1Icon),
		card1Title,
		card1Body: toCleanString(value.card1Body),
		card1CtaLabel: toCleanString(value.card1CtaLabel),
		card1CtaHref: toCleanString(value.card1CtaHref),
		card2Icon: toCleanString(value.card2Icon),
		card2Title,
		card2Body: toCleanString(value.card2Body),
		card2CtaLabel: toCleanString(value.card2CtaLabel),
		card2CtaHref: toCleanString(value.card2CtaHref),
		card3Icon: toCleanString(value.card3Icon),
		card3Title,
		card3Body: toCleanString(value.card3Body),
		card3CtaLabel: toCleanString(value.card3CtaLabel),
		card3CtaHref: toCleanString(value.card3CtaHref),
		card4Icon: toCleanString(value.card4Icon),
		card4Title,
		card4Body: toCleanString(value.card4Body),
		card4CtaLabel: toCleanString(value.card4CtaLabel),
		card4CtaHref: toCleanString(value.card4CtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeShippingReturnsPanelSection(
	value: Record<string, unknown>,
): HomepageShippingReturnsPanelSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const shippingTitle = toCleanString(value.shippingTitle);
	const returnsTitle = toCleanString(value.returnsTitle);
	if (!heading && !subtitle && !shippingTitle && !returnsTitle) return null;
	return {
		type: "shipping-returns-panel",
		heading,
		subtitle,
		shippingTitle,
		shippingBody: toCleanString(value.shippingBody),
		returnsTitle,
		returnsBody: toCleanString(value.returnsBody),
		paymentTitle: toCleanString(value.paymentTitle),
		paymentBody: toCleanString(value.paymentBody),
		supportTitle: toCleanString(value.supportTitle),
		supportBody: toCleanString(value.supportBody),
		primaryCtaLabel: toCleanString(value.primaryCtaLabel),
		primaryCtaHref: toCleanString(value.primaryCtaHref),
		secondaryCtaLabel: toCleanString(value.secondaryCtaLabel),
		secondaryCtaHref: toCleanString(value.secondaryCtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeSupportContactSplitSection(
	value: Record<string, unknown>,
): HomepageSupportContactSplitSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const leftTitle = toCleanString(value.leftTitle);
	const channel1Label = toCleanString(value.channel1Label);
	const slaTitle = toCleanString(value.slaTitle);
	if (!heading && !subtitle && !leftTitle && !channel1Label && !slaTitle) return null;
	return {
		type: "support-contact-split",
		heading,
		subtitle,
		leftTitle,
		leftBody: toCleanString(value.leftBody),
		channel1Label,
		channel1Value: toCleanString(value.channel1Value),
		channel1Href: toCleanString(value.channel1Href),
		channel2Label: toCleanString(value.channel2Label),
		channel2Value: toCleanString(value.channel2Value),
		channel2Href: toCleanString(value.channel2Href),
		channel3Label: toCleanString(value.channel3Label),
		channel3Value: toCleanString(value.channel3Value),
		channel3Href: toCleanString(value.channel3Href),
		slaTitle,
		slaBody: toCleanString(value.slaBody),
		slaBadge: toCleanString(value.slaBadge),
		primaryCtaLabel: toCleanString(value.primaryCtaLabel),
		primaryCtaHref: toCleanString(value.primaryCtaHref),
		secondaryCtaLabel: toCleanString(value.secondaryCtaLabel),
		secondaryCtaHref: toCleanString(value.secondaryCtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeFaqCategoryPillsSection(
	value: Record<string, unknown>,
): HomepageFaqCategoryPillsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const category1Name = toCleanString(value.category1Name);
	const category2Name = toCleanString(value.category2Name);
	const category3Name = toCleanString(value.category3Name);
	if (!heading && !subtitle && !category1Name && !category2Name && !category3Name) return null;
	return {
		type: "faq-category-pills",
		heading,
		subtitle,
		category1Name,
		category1Q1: toCleanString(value.category1Q1),
		category1A1: toCleanString(value.category1A1),
		category1Q2: toCleanString(value.category1Q2),
		category1A2: toCleanString(value.category1A2),
		category2Name,
		category2Q1: toCleanString(value.category2Q1),
		category2A1: toCleanString(value.category2A1),
		category2Q2: toCleanString(value.category2Q2),
		category2A2: toCleanString(value.category2A2),
		category3Name,
		category3Q1: toCleanString(value.category3Q1),
		category3A1: toCleanString(value.category3A1),
		category3Q2: toCleanString(value.category3Q2),
		category3A2: toCleanString(value.category3A2),
		defaultCategory:
			value.defaultCategory === "category2" || value.defaultCategory === "category3"
				? value.defaultCategory
				: "category1",
		helpCtaLabel: toCleanString(value.helpCtaLabel),
		helpCtaHref: toCleanString(value.helpCtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizePromoTileMosaicSection(
	value: Record<string, unknown>,
): HomepagePromoTileMosaicSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const tile1Title = toCleanString(value.tile1Title);
	const tile2Title = toCleanString(value.tile2Title);
	const tile3Title = toCleanString(value.tile3Title);
	const tile4Title = toCleanString(value.tile4Title);
	if (!heading && !subtitle && !tile1Title && !tile2Title && !tile3Title && !tile4Title) return null;
	return {
		type: "promo-tile-mosaic",
		heading,
		subtitle,
		tile1Badge: toCleanString(value.tile1Badge),
		tile1Title,
		tile1Body: toCleanString(value.tile1Body),
		tile1CtaLabel: toCleanString(value.tile1CtaLabel),
		tile1CtaHref: toCleanString(value.tile1CtaHref),
		tile2Badge: toCleanString(value.tile2Badge),
		tile2Title,
		tile2Body: toCleanString(value.tile2Body),
		tile2CtaLabel: toCleanString(value.tile2CtaLabel),
		tile2CtaHref: toCleanString(value.tile2CtaHref),
		tile3Badge: toCleanString(value.tile3Badge),
		tile3Title,
		tile3Body: toCleanString(value.tile3Body),
		tile3CtaLabel: toCleanString(value.tile3CtaLabel),
		tile3CtaHref: toCleanString(value.tile3CtaHref),
		tile4Badge: toCleanString(value.tile4Badge),
		tile4Title,
		tile4Body: toCleanString(value.tile4Body),
		tile4CtaLabel: toCleanString(value.tile4CtaLabel),
		tile4CtaHref: toCleanString(value.tile4CtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeBundlePriceBreakdownSection(
	value: Record<string, unknown>,
): HomepageBundlePriceBreakdownSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const planName = toCleanString(value.planName);
	const totalLabel = toCleanString(value.totalLabel);
	if (!heading && !subtitle && !planName && !totalLabel) return null;
	return {
		type: "bundle-price-breakdown",
		heading,
		subtitle,
		planName,
		item1Label: toCleanString(value.item1Label),
		item1Price: toCleanString(value.item1Price),
		item2Label: toCleanString(value.item2Label),
		item2Price: toCleanString(value.item2Price),
		item3Label: toCleanString(value.item3Label),
		item3Price: toCleanString(value.item3Price),
		totalLabel,
		totalPrice: toCleanString(value.totalPrice),
		saveLabel: toCleanString(value.saveLabel),
		saveValue: toCleanString(value.saveValue),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		note: toCleanString(value.note),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeStoreHoursStatusSection(
	value: Record<string, unknown>,
): HomepageStoreHoursStatusSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const statusText = toCleanString(value.statusText);
	const weekdayHours = toCleanString(value.weekdayHours);
	if (!heading && !subtitle && !statusText && !weekdayHours) return null;
	return {
		type: "store-hours-status",
		heading,
		subtitle,
		timezoneLabel: toCleanString(value.timezoneLabel),
		statusMode: value.statusMode === "closed" || value.statusMode === "notice" ? value.statusMode : "open",
		statusText,
		weekdayHours,
		weekendHours: toCleanString(value.weekendHours),
		holidayHours: toCleanString(value.holidayHours),
		noticeText: toCleanString(value.noticeText),
		primaryCtaLabel: toCleanString(value.primaryCtaLabel),
		primaryCtaHref: toCleanString(value.primaryCtaHref),
		secondaryCtaLabel: toCleanString(value.secondaryCtaLabel),
		secondaryCtaHref: toCleanString(value.secondaryCtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeTrustFaqStripSection(value: Record<string, unknown>): HomepageTrustFaqStripSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const trust1Label = toCleanString(value.trust1Label);
	const faq1Q = toCleanString(value.faq1Q);
	if (!heading && !subtitle && !trust1Label && !faq1Q) return null;
	return {
		type: "trust-faq-strip",
		heading,
		subtitle,
		trust1Icon: toCleanString(value.trust1Icon),
		trust1Label,
		trust2Icon: toCleanString(value.trust2Icon),
		trust2Label: toCleanString(value.trust2Label),
		trust3Icon: toCleanString(value.trust3Icon),
		trust3Label: toCleanString(value.trust3Label),
		faq1Q,
		faq1A: toCleanString(value.faq1A),
		faq2Q: toCleanString(value.faq2Q),
		faq2A: toCleanString(value.faq2A),
		faq3Q: toCleanString(value.faq3Q),
		faq3A: toCleanString(value.faq3A),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeUspMetricsSplitSection(
	value: Record<string, unknown>,
): HomepageUspMetricsSplitSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const usp1Title = toCleanString(value.usp1Title);
	const metric1Label = toCleanString(value.metric1Label);
	if (!heading && !subtitle && !usp1Title && !metric1Label) return null;
	return {
		type: "usp-metrics-split",
		heading,
		subtitle,
		usp1Title,
		usp1Body: toCleanString(value.usp1Body),
		usp2Title: toCleanString(value.usp2Title),
		usp2Body: toCleanString(value.usp2Body),
		usp3Title: toCleanString(value.usp3Title),
		usp3Body: toCleanString(value.usp3Body),
		metric1Label,
		metric1Value: toCleanString(value.metric1Value),
		metric1Note: toCleanString(value.metric1Note),
		metric2Label: toCleanString(value.metric2Label),
		metric2Value: toCleanString(value.metric2Value),
		metric2Note: toCleanString(value.metric2Note),
		metric3Label: toCleanString(value.metric3Label),
		metric3Value: toCleanString(value.metric3Value),
		metric3Note: toCleanString(value.metric3Note),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeCategoryPromoRailSection(
	value: Record<string, unknown>,
): HomepageCategoryPromoRailSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const category1Name = toCleanString(value.category1Name);
	const promo1Title = toCleanString(value.promo1Title);
	if (!heading && !subtitle && !category1Name && !promo1Title) return null;
	return {
		type: "category-promo-rail",
		heading,
		subtitle,
		category1Name,
		category1Href: toCleanString(value.category1Href),
		category2Name: toCleanString(value.category2Name),
		category2Href: toCleanString(value.category2Href),
		category3Name: toCleanString(value.category3Name),
		category3Href: toCleanString(value.category3Href),
		promo1Badge: toCleanString(value.promo1Badge),
		promo1Title,
		promo1Body: toCleanString(value.promo1Body),
		promo1CtaLabel: toCleanString(value.promo1CtaLabel),
		promo1CtaHref: toCleanString(value.promo1CtaHref),
		promo2Badge: toCleanString(value.promo2Badge),
		promo2Title: toCleanString(value.promo2Title),
		promo2Body: toCleanString(value.promo2Body),
		promo2CtaLabel: toCleanString(value.promo2CtaLabel),
		promo2CtaHref: toCleanString(value.promo2CtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeHelpdeskQuickFaqSection(
	value: Record<string, unknown>,
): HomepageHelpdeskQuickFaqSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const faq1Q = toCleanString(value.faq1Q);
	const channel1Label = toCleanString(value.channel1Label);
	if (!heading && !subtitle && !faq1Q && !channel1Label) return null;
	return {
		type: "helpdesk-quick-faq",
		heading,
		subtitle,
		faq1Q,
		faq1A: toCleanString(value.faq1A),
		faq2Q: toCleanString(value.faq2Q),
		faq2A: toCleanString(value.faq2A),
		faq3Q: toCleanString(value.faq3Q),
		faq3A: toCleanString(value.faq3A),
		channel1Label,
		channel1Value: toCleanString(value.channel1Value),
		channel1Href: toCleanString(value.channel1Href),
		channel2Label: toCleanString(value.channel2Label),
		channel2Value: toCleanString(value.channel2Value),
		channel2Href: toCleanString(value.channel2Href),
		primaryCtaLabel: toCleanString(value.primaryCtaLabel),
		primaryCtaHref: toCleanString(value.primaryCtaHref),
		secondaryCtaLabel: toCleanString(value.secondaryCtaLabel),
		secondaryCtaHref: toCleanString(value.secondaryCtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeStickyAnnouncementQueueSection(
	value: Record<string, unknown>,
): HomepageStickyAnnouncementQueueSection | null {
	const heading = toCleanString(value.heading);
	const announce1Text = toCleanString(value.announce1Text);
	if (!heading && !announce1Text) return null;
	return {
		type: "sticky-announcement-queue",
		heading,
		announce1Text,
		announce1Level:
			value.announce1Level === "success" || value.announce1Level === "warning"
				? value.announce1Level
				: "info",
		announce1Href: toCleanString(value.announce1Href),
		announce2Text: toCleanString(value.announce2Text),
		announce2Level:
			value.announce2Level === "success" || value.announce2Level === "warning"
				? value.announce2Level
				: "info",
		announce2Href: toCleanString(value.announce2Href),
		announce3Text: toCleanString(value.announce3Text),
		announce3Level:
			value.announce3Level === "success" || value.announce3Level === "warning"
				? value.announce3Level
				: "info",
		announce3Href: toCleanString(value.announce3Href),
		autoRotateSeconds: toPositiveIntInRange(value.autoRotateSeconds, 3, 30),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeTieredPricingTableSection(
	value: Record<string, unknown>,
): HomepageTieredPricingTableSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const tier1Name = toCleanString(value.tier1Name);
	const tier1Price = toCleanString(value.tier1Price);
	if (!heading && !subtitle && !tier1Name && !tier1Price) return null;
	return {
		type: "tiered-pricing-table",
		heading,
		subtitle,
		tier1Name,
		tier1Price,
		tier1Features: toCleanString(value.tier1Features),
		tier1CtaLabel: toCleanString(value.tier1CtaLabel),
		tier1CtaHref: toCleanString(value.tier1CtaHref),
		tier2Name: toCleanString(value.tier2Name),
		tier2Price: toCleanString(value.tier2Price),
		tier2Features: toCleanString(value.tier2Features),
		tier2CtaLabel: toCleanString(value.tier2CtaLabel),
		tier2CtaHref: toCleanString(value.tier2CtaHref),
		tier3Name: toCleanString(value.tier3Name),
		tier3Price: toCleanString(value.tier3Price),
		tier3Features: toCleanString(value.tier3Features),
		tier3CtaLabel: toCleanString(value.tier3CtaLabel),
		tier3CtaHref: toCleanString(value.tier3CtaHref),
		highlightTier:
			value.highlightTier === "tier1" || value.highlightTier === "tier3" ? value.highlightTier : "tier2",
		style: sanitizeStyleProps(value),
	};
}

function sanitizeServiceProcessStepsSection(
	value: Record<string, unknown>,
): HomepageServiceProcessStepsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const step1Title = toCleanString(value.step1Title);
	if (!heading && !subtitle && !step1Title) return null;
	return {
		type: "service-process-steps",
		heading,
		subtitle,
		step1Title,
		step1Body: toCleanString(value.step1Body),
		step2Title: toCleanString(value.step2Title),
		step2Body: toCleanString(value.step2Body),
		step3Title: toCleanString(value.step3Title),
		step3Body: toCleanString(value.step3Body),
		step4Title: toCleanString(value.step4Title),
		step4Body: toCleanString(value.step4Body),
		note: toCleanString(value.note),
		primaryCtaLabel: toCleanString(value.primaryCtaLabel),
		primaryCtaHref: toCleanString(value.primaryCtaHref),
		secondaryCtaLabel: toCleanString(value.secondaryCtaLabel),
		secondaryCtaHref: toCleanString(value.secondaryCtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeInventoryAvailabilityMatrixSection(
	value: Record<string, unknown>,
): HomepageInventoryAvailabilityMatrixSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const item1Name = toCleanString(value.item1Name);
	const item1Stock = toCleanString(value.item1Stock);
	if (!heading && !subtitle && !item1Name && !item1Stock) return null;
	return {
		type: "inventory-availability-matrix",
		heading,
		subtitle,
		item1Name,
		item1Stock,
		item1Eta: toCleanString(value.item1Eta),
		item2Name: toCleanString(value.item2Name),
		item2Stock: toCleanString(value.item2Stock),
		item2Eta: toCleanString(value.item2Eta),
		item3Name: toCleanString(value.item3Name),
		item3Stock: toCleanString(value.item3Stock),
		item3Eta: toCleanString(value.item3Eta),
		warehouseNote: toCleanString(value.warehouseNote),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeCrossBorderShippingNoticeSection(
	value: Record<string, unknown>,
): HomepageCrossBorderShippingNoticeSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const region1Name = toCleanString(value.region1Name);
	const region1Eta = toCleanString(value.region1Eta);
	if (!heading && !subtitle && !region1Name && !region1Eta) return null;
	return {
		type: "cross-border-shipping-notice",
		heading,
		subtitle,
		region1Name,
		region1Eta,
		region1Duty: toCleanString(value.region1Duty),
		region2Name: toCleanString(value.region2Name),
		region2Eta: toCleanString(value.region2Eta),
		region2Duty: toCleanString(value.region2Duty),
		region3Name: toCleanString(value.region3Name),
		region3Eta: toCleanString(value.region3Eta),
		region3Duty: toCleanString(value.region3Duty),
		policyNote: toCleanString(value.policyNote),
		primaryCtaLabel: toCleanString(value.primaryCtaLabel),
		primaryCtaHref: toCleanString(value.primaryCtaHref),
		secondaryCtaLabel: toCleanString(value.secondaryCtaLabel),
		secondaryCtaHref: toCleanString(value.secondaryCtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeReturnsPolicyQuickCardsSection(
	value: Record<string, unknown>,
): HomepageReturnsPolicyQuickCardsSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const card1Title = toCleanString(value.card1Title);
	const card1Body = toCleanString(value.card1Body);
	if (!heading && !subtitle && !card1Title && !card1Body) return null;
	return {
		type: "returns-policy-quick-cards",
		heading,
		subtitle,
		card1Title,
		card1Body,
		card1Limit: toCleanString(value.card1Limit),
		card2Title: toCleanString(value.card2Title),
		card2Body: toCleanString(value.card2Body),
		card2Limit: toCleanString(value.card2Limit),
		card3Title: toCleanString(value.card3Title),
		card3Body: toCleanString(value.card3Body),
		card3Limit: toCleanString(value.card3Limit),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeComplianceCertificatesGridSection(
	value: Record<string, unknown>,
): HomepageComplianceCertificatesGridSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const cert1Title = toCleanString(value.cert1Title);
	const cert1Code = toCleanString(value.cert1Code);
	if (!heading && !subtitle && !cert1Title && !cert1Code) return null;
	return {
		type: "compliance-certificates-grid",
		heading,
		subtitle,
		cert1Title,
		cert1Code,
		cert1Issuer: toCleanString(value.cert1Issuer),
		cert2Title: toCleanString(value.cert2Title),
		cert2Code: toCleanString(value.cert2Code),
		cert2Issuer: toCleanString(value.cert2Issuer),
		cert3Title: toCleanString(value.cert3Title),
		cert3Code: toCleanString(value.cert3Code),
		cert3Issuer: toCleanString(value.cert3Issuer),
		cert4Title: toCleanString(value.cert4Title),
		cert4Code: toCleanString(value.cert4Code),
		cert4Issuer: toCleanString(value.cert4Issuer),
		note: toCleanString(value.note),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeBulkOrderInquiryStripSection(
	value: Record<string, unknown>,
): HomepageBulkOrderInquiryStripSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const minOrderLabel = toCleanString(value.minOrderLabel);
	const minOrderValue = toCleanString(value.minOrderValue);
	if (!heading && !subtitle && !minOrderLabel && !minOrderValue) return null;
	return {
		type: "bulk-order-inquiry-strip",
		heading,
		subtitle,
		minOrderLabel,
		minOrderValue,
		leadTimeLabel: toCleanString(value.leadTimeLabel),
		leadTimeValue: toCleanString(value.leadTimeValue),
		customizationLabel: toCleanString(value.customizationLabel),
		customizationValue: toCleanString(value.customizationValue),
		contactLabel: toCleanString(value.contactLabel),
		contactValue: toCleanString(value.contactValue),
		primaryCtaLabel: toCleanString(value.primaryCtaLabel),
		primaryCtaHref: toCleanString(value.primaryCtaHref),
		secondaryCtaLabel: toCleanString(value.secondaryCtaLabel),
		secondaryCtaHref: toCleanString(value.secondaryCtaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeRegionalServiceMapLiteSection(
	value: Record<string, unknown>,
): HomepageRegionalServiceMapLiteSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const region1Name = toCleanString(value.region1Name);
	const region1Coverage = toCleanString(value.region1Coverage);
	if (!heading && !subtitle && !region1Name && !region1Coverage) return null;
	return {
		type: "regional-service-map-lite",
		heading,
		subtitle,
		region1Name,
		region1Coverage,
		region1Sla: toCleanString(value.region1Sla),
		region2Name: toCleanString(value.region2Name),
		region2Coverage: toCleanString(value.region2Coverage),
		region2Sla: toCleanString(value.region2Sla),
		region3Name: toCleanString(value.region3Name),
		region3Coverage: toCleanString(value.region3Coverage),
		region3Sla: toCleanString(value.region3Sla),
		region4Name: toCleanString(value.region4Name),
		region4Coverage: toCleanString(value.region4Coverage),
		region4Sla: toCleanString(value.region4Sla),
		note: toCleanString(value.note),
		ctaLabel: toCleanString(value.ctaLabel),
		ctaHref: toCleanString(value.ctaHref),
		style: sanitizeStyleProps(value),
	};
}

function sanitizeContainerSection(value: Record<string, unknown>): HomepageContainerSection | null {
	const heading = toCleanString(value.heading);
	const body = toCleanString(value.body);
	const eyebrow = toCleanString(value.eyebrow);
	if (!heading && !body && !eyebrow) return null;
	return {
		type: "container",
		eyebrow,
		heading,
		body,
		backgroundColor: toCleanString(value.backgroundColor),
		backgroundImageUrl: toCleanString(value.backgroundImageUrl),
		textColor: toCleanString(value.textColor),
		contentAlign: value.contentAlign === "center" ? "center" : "left",
		widthMode:
			value.widthMode === "narrow" || value.widthMode === "wide" || value.widthMode === "full"
				? value.widthMode
				: "normal",
		minHeight: toPositiveIntInRange(value.minHeight, MIN_SECTION_MIN_HEIGHT, MAX_SECTION_MIN_HEIGHT),
		paddingX: toPositiveIntInRange(value.paddingX, MIN_SECTION_PADDING, MAX_SECTION_PADDING),
		paddingY: toPositiveIntInRange(value.paddingY, MIN_SECTION_PADDING, MAX_SECTION_PADDING),
		titleSize: value.titleSize === "md" || value.titleSize === "xl" ? value.titleSize : "lg",
		bodySize: value.bodySize === "sm" || value.bodySize === "lg" ? value.bodySize : "md",
		buttonLabel: toCleanString(value.buttonLabel),
		buttonHref: toCleanString(value.buttonHref),
		buttonVariant: value.buttonVariant === "outline" ? "outline" : "solid",
		buttonSize: value.buttonSize === "sm" || value.buttonSize === "lg" ? value.buttonSize : "md",
		style: sanitizeStyleProps(value),
	};
}

function sanitizeButtonRowSection(value: Record<string, unknown>): HomepageButtonRowSection | null {
	const heading = toCleanString(value.heading);
	const subtitle = toCleanString(value.subtitle);
	const primaryLabel = toCleanString(value.primaryLabel);
	const secondaryLabel = toCleanString(value.secondaryLabel);
	if (!heading && !subtitle && !primaryLabel && !secondaryLabel) return null;
	return {
		type: "button-row",
		heading,
		subtitle,
		primaryLabel,
		primaryHref: toCleanString(value.primaryHref),
		secondaryLabel,
		secondaryHref: toCleanString(value.secondaryHref),
		buttonSize: value.buttonSize === "sm" || value.buttonSize === "lg" ? value.buttonSize : "md",
		align: value.align === "center" ? "center" : "left",
		style: sanitizeStyleProps(value),
	};
}

function sanitizeSpacerSection(value: Record<string, unknown>): HomepageSpacerSection | null {
	const height = toPositiveIntInRange(value.height, MIN_SPACER_HEIGHT, MAX_SPACER_HEIGHT) || 48;
	return {
		type: "spacer",
		height,
	};
}

function sanitizeSection(rawSection: unknown): HomepageSection | null {
	if (!isRecord(rawSection)) return null;
	const type = rawSection.type;
	if (type === "featured-products") return sanitizeFeaturedProductsSection(rawSection);
	if (type === "hero") return sanitizeHeroSection(rawSection);
	if (type === "rich-text") return sanitizeRichTextSection(rawSection);
	if (type === "heading") return sanitizeHeadingSection(rawSection);
	if (type === "image-banner") return sanitizeImageBannerSection(rawSection);
	if (type === "icon-list") return sanitizeIconListSection(rawSection);
	if (type === "faq-accordion") return sanitizeFaqAccordionSection(rawSection);
	if (type === "featured-collections") return sanitizeFeaturedCollectionsSection(rawSection);
	if (type === "promo-banner") return sanitizePromoBannerSection(rawSection);
	if (type === "testimonials") return sanitizeTestimonialsSection(rawSection);
	if (type === "store-policies") return sanitizeStorePoliciesSection(rawSection);
	if (type === "category-grid") return sanitizeCategoryGridSection(rawSection);
	if (type === "product-spotlight") return sanitizeProductSpotlightSection(rawSection);
	if (type === "countdown") return sanitizeCountdownSection(rawSection);
	if (type === "featured-categories-auto") return sanitizeFeaturedCategoriesAutoSection(rawSection);
	if (type === "logo-cloud") return sanitizeLogoCloudSection(rawSection);
	if (type === "timeline-steps") return sanitizeTimelineStepsSection(rawSection);
	if (type === "collection-hero") return sanitizeCollectionHeroSection(rawSection);
	if (type === "contact-quick-actions") return sanitizeContactQuickActionsSection(rawSection);
	if (type === "stats-counter") return sanitizeStatsCounterSection(rawSection);
	if (type === "card-grid") return sanitizeCardGridSection(rawSection);
	if (type === "newsletter-signup") return sanitizeNewsletterSignupSection(rawSection);
	if (type === "video-embed") return sanitizeVideoEmbedSection(rawSection);
	if (type === "announcement-bar") return sanitizeAnnouncementBarSection(rawSection);
	if (type === "trust-badges") return sanitizeTrustBadgesSection(rawSection);
	if (type === "contact-form-lite") return sanitizeContactFormLiteSection(rawSection);
	if (type === "tabs-content") return sanitizeTabsContentSection(rawSection);
	if (type === "before-after") return sanitizeBeforeAfterSection(rawSection);
	if (type === "social-proof-feed") return sanitizeSocialProofFeedSection(rawSection);
	if (type === "faq-compact") return sanitizeFaqCompactSection(rawSection);
	if (type === "metric-cards") return sanitizeMetricCardsSection(rawSection);
	if (type === "media-text-split") return sanitizeMediaTextSplitSection(rawSection);
	if (type === "quote-highlight") return sanitizeQuoteHighlightSection(rawSection);
	if (type === "feature-comparison") return sanitizeFeatureComparisonSection(rawSection);
	if (type === "inline-cta-banner") return sanitizeInlineCtaBannerSection(rawSection);
	if (type === "logo-strip-compact") return sanitizeLogoStripCompactSection(rawSection);
	if (type === "event-highlights") return sanitizeEventHighlightsSection(rawSection);
	if (type === "cta-card-pair") return sanitizeCtaCardPairSection(rawSection);
	if (type === "faq-with-cta") return sanitizeFaqWithCtaSection(rawSection);
	if (type === "partner-metrics") return sanitizePartnerMetricsSection(rawSection);
	if (type === "story-steps") return sanitizeStoryStepsSection(rawSection);
	if (type === "media-carousel") return sanitizeMediaCarouselSection(rawSection);
	if (type === "feature-checklist") return sanitizeFeatureChecklistSection(rawSection);
	if (type === "mini-blog-cards") return sanitizeMiniBlogCardsSection(rawSection);
	if (type === "trust-logo-wall") return sanitizeTrustLogoWallSection(rawSection);
	if (type === "dual-hero-split") return sanitizeDualHeroSplitSection(rawSection);
	if (type === "quick-links-grid") return sanitizeQuickLinksGridSection(rawSection);
	if (type === "store-locator-lite") return sanitizeStoreLocatorLiteSection(rawSection);
	if (type === "timeline-compact") return sanitizeTimelineCompactSection(rawSection);
	if (type === "faq-cards") return sanitizeFaqCardsSection(rawSection);
	if (type === "product-comparison-lite") return sanitizeProductComparisonLiteSection(rawSection);
	if (type === "cta-marquee") return sanitizeCtaMarqueeSection(rawSection);
	if (type === "faq-accordion-plus") return sanitizeFaqAccordionPlusSection(rawSection);
	if (type === "usp-pill-row") return sanitizeUspPillRowSection(rawSection);
	if (type === "pricing-card-lite") return sanitizePricingCardLiteSection(rawSection);
	if (type === "brand-story-timeline") return sanitizeBrandStoryTimelineSection(rawSection);
	if (type === "social-links-bar") return sanitizeSocialLinksBarSection(rawSection);
	if (type === "feature-table-lite") return sanitizeFeatureTableLiteSection(rawSection);
	if (type === "team-intro-cards") return sanitizeTeamIntroCardsSection(rawSection);
	if (type === "logo-with-cta-strip") return sanitizeLogoWithCtaStripSection(rawSection);
	if (type === "testimonial-marquee-lite") return sanitizeTestimonialMarqueeLiteSection(rawSection);
	if (type === "feature-icon-table") return sanitizeFeatureIconTableSection(rawSection);
	if (type === "faq-two-column") return sanitizeFaqTwoColumnSection(rawSection);
	if (type === "product-bundle-lite") return sanitizeProductBundleLiteSection(rawSection);
	if (type === "announcement-stack") return sanitizeAnnouncementStackSection(rawSection);
	if (type === "product-feature-tabs") return sanitizeProductFeatureTabsSection(rawSection);
	if (type === "benefit-cards-grid") return sanitizeBenefitCardsGridSection(rawSection);
	if (type === "shipping-returns-panel") return sanitizeShippingReturnsPanelSection(rawSection);
	if (type === "support-contact-split") return sanitizeSupportContactSplitSection(rawSection);
	if (type === "faq-category-pills") return sanitizeFaqCategoryPillsSection(rawSection);
	if (type === "promo-tile-mosaic") return sanitizePromoTileMosaicSection(rawSection);
	if (type === "bundle-price-breakdown") return sanitizeBundlePriceBreakdownSection(rawSection);
	if (type === "store-hours-status") return sanitizeStoreHoursStatusSection(rawSection);
	if (type === "trust-faq-strip") return sanitizeTrustFaqStripSection(rawSection);
	if (type === "usp-metrics-split") return sanitizeUspMetricsSplitSection(rawSection);
	if (type === "category-promo-rail") return sanitizeCategoryPromoRailSection(rawSection);
	if (type === "helpdesk-quick-faq") return sanitizeHelpdeskQuickFaqSection(rawSection);
	if (type === "sticky-announcement-queue") return sanitizeStickyAnnouncementQueueSection(rawSection);
	if (type === "tiered-pricing-table") return sanitizeTieredPricingTableSection(rawSection);
	if (type === "service-process-steps") return sanitizeServiceProcessStepsSection(rawSection);
	if (type === "inventory-availability-matrix") return sanitizeInventoryAvailabilityMatrixSection(rawSection);
	if (type === "cross-border-shipping-notice") return sanitizeCrossBorderShippingNoticeSection(rawSection);
	if (type === "returns-policy-quick-cards") return sanitizeReturnsPolicyQuickCardsSection(rawSection);
	if (type === "compliance-certificates-grid") return sanitizeComplianceCertificatesGridSection(rawSection);
	if (type === "bulk-order-inquiry-strip") return sanitizeBulkOrderInquiryStripSection(rawSection);
	if (type === "regional-service-map-lite") return sanitizeRegionalServiceMapLiteSection(rawSection);
	if (type === "container") return sanitizeContainerSection(rawSection);
	if (type === "button-row") return sanitizeButtonRowSection(rawSection);
	if (type === "spacer") return sanitizeSpacerSection(rawSection);
	return null;
}

function parseHomepageLayout(raw: string | null | undefined): HomepageLayout | undefined {
	if (!raw) return undefined;
	try {
		const parsed = JSON.parse(raw) as unknown;
		if (!isRecord(parsed)) return undefined;
		if (!Array.isArray(parsed.sections)) return undefined;

		const sections = parsed.sections
			.map(sanitizeSection)
			.filter((section): section is HomepageSection => section !== null);
		if (!sections.length) return undefined;

		const schemaVersion =
			toPositiveIntInRange(parsed.schemaVersion, 1, 999) || DEFAULT_HOMEPAGE_LAYOUT.schemaVersion;
		return {
			schemaVersion,
			sections: sections.slice(0, MAX_SECTIONS),
			updatedAt: toCleanString(parsed.updatedAt),
			version: toPositiveIntInRange(parsed.version, 1, Number.MAX_SAFE_INTEGER),
			note: toCleanString(parsed.note),
		};
	} catch {
		return undefined;
	}
}

export function resolveHomepageLayout(
	base: HomepageLayout = DEFAULT_HOMEPAGE_LAYOUT,
	overrides?: HomepageLayout,
): HomepageLayout {
	if (!overrides?.sections?.length) {
		return base;
	}
	return {
		schemaVersion: overrides.schemaVersion || base.schemaVersion,
		sections: overrides.sections,
		updatedAt: overrides.updatedAt,
		version: overrides.version,
		note: overrides.note,
	};
}

export function getHomepageLayoutFromHeaders(
	host: string | null | undefined,
	headerValues?: HeaderValues,
): HomepageLayout {
	const normalizedHost = normalizeHost(host || "");
	const base = DEFAULT_HOMEPAGE_LAYOUT;
	const parsed = parseHomepageLayout(headerValues?.homepageLayout);
	if (!parsed) {
		return base;
	}
	if (normalizedHost) {
		return resolveHomepageLayout(base, parsed);
	}
	return resolveHomepageLayout(base, parsed);
}
