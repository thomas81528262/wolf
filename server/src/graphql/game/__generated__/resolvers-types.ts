import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum ActRoleType {
  Guard = 'GUARD',
  Hunter = 'HUNTER',
  Prophet = 'PROPHET',
  WitchKill = 'WITCH_KILL',
  WitchSave = 'WITCH_SAVE',
  Wolf = 'WOLF'
}

export type ChiefVoteState = {
  __typename?: 'ChiefVoteState';
  isCandidate?: Maybe<Scalars['Boolean']['output']>;
  isDropout?: Maybe<Scalars['Boolean']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type GameInfo = {
  __typename?: 'GameInfo';
  chiefId?: Maybe<Scalars['Int']['output']>;
  chiefVoteState?: Maybe<ChiefVoteState>;
  gameEnded?: Maybe<Scalars['Boolean']['output']>;
  hasChief?: Maybe<Scalars['Boolean']['output']>;
  hasVoteTarget?: Maybe<Scalars['Boolean']['output']>;
  isChiefCandidateConfirmed?: Maybe<Scalars['Boolean']['output']>;
  isDark?: Maybe<Scalars['Boolean']['output']>;
  isEventBusy?: Maybe<Scalars['Boolean']['output']>;
  isVoteFinish?: Maybe<Scalars['Boolean']['output']>;
  repeatTimes?: Maybe<Scalars['Int']['output']>;
  uuid?: Maybe<Scalars['String']['output']>;
  voteWeightedId?: Maybe<Scalars['Int']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addNewTemplate?: Maybe<Scalars['String']['output']>;
  deleteTemplate?: Maybe<Scalars['String']['output']>;
  enableTemplate?: Maybe<Scalars['String']['output']>;
  generatePlayer?: Maybe<Scalars['String']['output']>;
  generateRole?: Maybe<Scalars['String']['output']>;
  generateTemplatePlayer?: Maybe<Scalars['String']['output']>;
  generateTemplateRole?: Maybe<Scalars['String']['output']>;
  logoff?: Maybe<Scalars['String']['output']>;
  removeAllPlayer?: Maybe<Scalars['String']['output']>;
  resetChiefCaniddate?: Maybe<Scalars['String']['output']>;
  resetEvent?: Maybe<Scalars['String']['output']>;
  setChiefId?: Maybe<Scalars['String']['output']>;
  setDarkDieStatus?: Maybe<Scalars['String']['output']>;
  setDieStatus?: Maybe<Scalars['String']['output']>;
  setGameEnded?: Maybe<Scalars['String']['output']>;
  setIsChiefCandidate?: Maybe<Scalars['String']['output']>;
  setIsChiefDropOut?: Maybe<Scalars['String']['output']>;
  setIsVoter?: Maybe<Scalars['String']['output']>;
  setVoteWeightedId?: Maybe<Scalars['String']['output']>;
  submitVote?: Maybe<Scalars['String']['output']>;
  updatePass?: Maybe<Scalars['String']['output']>;
  updatePlayerName?: Maybe<Scalars['String']['output']>;
  updatePlayerPass?: Maybe<PlayerStatus>;
  updateRoleNumber?: Maybe<Scalars['String']['output']>;
  updateTemplateDescription?: Maybe<Scalars['String']['output']>;
  updateTemplateRole?: Maybe<Scalars['String']['output']>;
  updateTemplateRolePriority?: Maybe<Scalars['String']['output']>;
  voteChiefStart?: Maybe<Scalars['String']['output']>;
  voteStart?: Maybe<Scalars['String']['output']>;
};


export type MutationAddNewTemplateArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteTemplateArgs = {
  name: Scalars['String']['input'];
};


export type MutationEnableTemplateArgs = {
  name: Scalars['String']['input'];
};


export type MutationGenerateTemplateRoleArgs = {
  isCovertWolfToHuman: Scalars['Boolean']['input'];
};


export type MutationResetChiefCaniddateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSetChiefIdArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSetDarkDieStatusArgs = {
  targets: Array<Scalars['Int']['input']>;
};


export type MutationSetDieStatusArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSetVoteWeightedIdArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSubmitVoteArgs = {
  target: Scalars['Int']['input'];
};


export type MutationUpdatePassArgs = {
  id: Scalars['Int']['input'];
  pass: Scalars['String']['input'];
};


export type MutationUpdatePlayerNameArgs = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdatePlayerPassArgs = {
  id: Scalars['Int']['input'];
  pass: Scalars['String']['input'];
};


export type MutationUpdateRoleNumberArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateTemplateDescriptionArgs = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateTemplateRoleArgs = {
  name: Scalars['String']['input'];
  number: Scalars['Int']['input'];
  roleId: Scalars['Int']['input'];
};


export type MutationUpdateTemplateRolePriorityArgs = {
  ids: Array<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};


export type MutationVoteStartArgs = {
  targets: Array<Scalars['Int']['input']>;
};

export type Player = {
  __typename?: 'Player';
  chiefVote?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  chiefVoteState?: Maybe<ChiefVoteState>;
  id?: Maybe<Scalars['Int']['output']>;
  isChief?: Maybe<Scalars['Boolean']['output']>;
  isDie?: Maybe<Scalars['Boolean']['output']>;
  isEmpty?: Maybe<Scalars['Boolean']['output']>;
  isKill?: Maybe<Scalars['Boolean']['output']>;
  isTarget?: Maybe<Scalars['Boolean']['output']>;
  isValidCandidate?: Maybe<Scalars['Boolean']['output']>;
  isVoteFinish?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  pass?: Maybe<Scalars['String']['output']>;
  revealedRole?: Maybe<Scalars['String']['output']>;
  roleName?: Maybe<Scalars['String']['output']>;
  vote?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  votedNumber?: Maybe<Scalars['Float']['output']>;
};

export type PlayerAudienceView = {
  __typename?: 'PlayerAudienceView';
  chiefVote?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id?: Maybe<Scalars['Int']['output']>;
  isChief?: Maybe<Scalars['Boolean']['output']>;
  isDie?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  vote?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type PlayerStatus = {
  __typename?: 'PlayerStatus';
  id?: Maybe<Scalars['Int']['output']>;
  isValid?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  enabledTemplate?: Maybe<Template>;
  gameInfo?: Maybe<GameInfo>;
  login?: Maybe<PlayerStatus>;
  player?: Maybe<Player>;
  players?: Maybe<Array<Maybe<Player>>>;
  playersAudienceView?: Maybe<Array<Maybe<PlayerAudienceView>>>;
  roles?: Maybe<Array<Maybe<Role>>>;
  template?: Maybe<Template>;
  templates?: Maybe<Array<Maybe<Template>>>;
};


export type QueryGameInfoArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPlayerArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  pass?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTemplateArgs = {
  name: Scalars['String']['input'];
};

export type Role = {
  __typename?: 'Role';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['Int']['output']>;
};

export type RoleOrder = {
  id?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type Template = {
  __typename?: 'Template';
  description?: Maybe<Scalars['String']['output']>;
  isEnabled?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<Role>>>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  ActRoleType: ActRoleType;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChiefVoteState: ResolverTypeWrapper<ChiefVoteState>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GameInfo: ResolverTypeWrapper<GameInfo>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Player: ResolverTypeWrapper<Player>;
  PlayerAudienceView: ResolverTypeWrapper<PlayerAudienceView>;
  PlayerStatus: ResolverTypeWrapper<PlayerStatus>;
  Query: ResolverTypeWrapper<{}>;
  Role: ResolverTypeWrapper<Role>;
  RoleOrder: RoleOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Template: ResolverTypeWrapper<Template>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  ChiefVoteState: ChiefVoteState;
  Float: Scalars['Float']['output'];
  GameInfo: GameInfo;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Player: Player;
  PlayerAudienceView: PlayerAudienceView;
  PlayerStatus: PlayerStatus;
  Query: {};
  Role: Role;
  RoleOrder: RoleOrder;
  String: Scalars['String']['output'];
  Template: Template;
}>;

export type ChiefVoteStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChiefVoteState'] = ResolversParentTypes['ChiefVoteState']> = ResolversObject<{
  isCandidate?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isDropout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GameInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameInfo'] = ResolversParentTypes['GameInfo']> = ResolversObject<{
  chiefId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  chiefVoteState?: Resolver<Maybe<ResolversTypes['ChiefVoteState']>, ParentType, ContextType>;
  gameEnded?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasChief?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasVoteTarget?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isChiefCandidateConfirmed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isDark?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isEventBusy?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isVoteFinish?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  repeatTimes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  uuid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  voteWeightedId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addNewTemplate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationAddNewTemplateArgs, 'name'>>;
  deleteTemplate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationDeleteTemplateArgs, 'name'>>;
  enableTemplate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationEnableTemplateArgs, 'name'>>;
  generatePlayer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  generateRole?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  generateTemplatePlayer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  generateTemplateRole?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationGenerateTemplateRoleArgs, 'isCovertWolfToHuman'>>;
  logoff?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  removeAllPlayer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resetChiefCaniddate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationResetChiefCaniddateArgs, 'id'>>;
  resetEvent?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  setChiefId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSetChiefIdArgs, 'id'>>;
  setDarkDieStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSetDarkDieStatusArgs, 'targets'>>;
  setDieStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSetDieStatusArgs, 'id'>>;
  setGameEnded?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  setIsChiefCandidate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  setIsChiefDropOut?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  setIsVoter?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  setVoteWeightedId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSetVoteWeightedIdArgs, 'id'>>;
  submitVote?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSubmitVoteArgs, 'target'>>;
  updatePass?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationUpdatePassArgs, 'id' | 'pass'>>;
  updatePlayerName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationUpdatePlayerNameArgs, 'id' | 'name'>>;
  updatePlayerPass?: Resolver<Maybe<ResolversTypes['PlayerStatus']>, ParentType, ContextType, RequireFields<MutationUpdatePlayerPassArgs, 'id' | 'pass'>>;
  updateRoleNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationUpdateRoleNumberArgs>>;
  updateTemplateDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationUpdateTemplateDescriptionArgs, 'description' | 'name'>>;
  updateTemplateRole?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationUpdateTemplateRoleArgs, 'name' | 'number' | 'roleId'>>;
  updateTemplateRolePriority?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationUpdateTemplateRolePriorityArgs, 'ids' | 'name'>>;
  voteChiefStart?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  voteStart?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationVoteStartArgs, 'targets'>>;
}>;

export type PlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = ResolversObject<{
  chiefVote?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  chiefVoteState?: Resolver<Maybe<ResolversTypes['ChiefVoteState']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isChief?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isDie?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isEmpty?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isKill?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isTarget?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isValidCandidate?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isVoteFinish?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pass?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  revealedRole?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  roleName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vote?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  votedNumber?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlayerAudienceViewResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlayerAudienceView'] = ResolversParentTypes['PlayerAudienceView']> = ResolversObject<{
  chiefVote?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isChief?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isDie?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vote?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlayerStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlayerStatus'] = ResolversParentTypes['PlayerStatus']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isValid?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  enabledTemplate?: Resolver<Maybe<ResolversTypes['Template']>, ParentType, ContextType>;
  gameInfo?: Resolver<Maybe<ResolversTypes['GameInfo']>, ParentType, ContextType, RequireFields<QueryGameInfoArgs, 'id'>>;
  login?: Resolver<Maybe<ResolversTypes['PlayerStatus']>, ParentType, ContextType>;
  player?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType, Partial<QueryPlayerArgs>>;
  players?: Resolver<Maybe<Array<Maybe<ResolversTypes['Player']>>>, ParentType, ContextType>;
  playersAudienceView?: Resolver<Maybe<Array<Maybe<ResolversTypes['PlayerAudienceView']>>>, ParentType, ContextType>;
  roles?: Resolver<Maybe<Array<Maybe<ResolversTypes['Role']>>>, ParentType, ContextType>;
  template?: Resolver<Maybe<ResolversTypes['Template']>, ParentType, ContextType, RequireFields<QueryTemplateArgs, 'name'>>;
  templates?: Resolver<Maybe<Array<Maybe<ResolversTypes['Template']>>>, ParentType, ContextType>;
}>;

export type RoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  number?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TemplateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Template'] = ResolversParentTypes['Template']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isEnabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  roles?: Resolver<Maybe<Array<Maybe<ResolversTypes['Role']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  ChiefVoteState?: ChiefVoteStateResolvers<ContextType>;
  GameInfo?: GameInfoResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  PlayerAudienceView?: PlayerAudienceViewResolvers<ContextType>;
  PlayerStatus?: PlayerStatusResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  Template?: TemplateResolvers<ContextType>;
}>;

