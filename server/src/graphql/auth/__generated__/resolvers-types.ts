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

export type DarkInfo = {
  __typename?: 'DarkInfo';
  actRoleType?: Maybe<ActRoleType>;
  darkDay?: Maybe<Scalars['Int']['output']>;
  isStart?: Maybe<Scalars['Boolean']['output']>;
  remainTime?: Maybe<Scalars['Int']['output']>;
  targetList?: Maybe<Array<Maybe<Player>>>;
};

export type GameInfo = {
  __typename?: 'GameInfo';
  chiefId?: Maybe<Scalars['Int']['output']>;
  isVoteFinish?: Maybe<Scalars['Boolean']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  updatePlayerPass?: Maybe<PlayerStatus>;
};


export type MutationUpdatePlayerPassArgs = {
  id: Scalars['Int']['input'];
  pass: Scalars['String']['input'];
};

export type Player = {
  __typename?: 'Player';
  chiefVote?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id?: Maybe<Scalars['Int']['output']>;
  isDie?: Maybe<Scalars['Boolean']['output']>;
  isEmpty?: Maybe<Scalars['Boolean']['output']>;
  isKill?: Maybe<Scalars['Boolean']['output']>;
  isValidCandidate?: Maybe<Scalars['Boolean']['output']>;
  isVoteFinish?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  revealedRole?: Maybe<Scalars['String']['output']>;
  roleName?: Maybe<Scalars['String']['output']>;
  vote?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  votedNumber?: Maybe<Scalars['Float']['output']>;
};

export type PlayerStatus = {
  __typename?: 'PlayerStatus';
  id?: Maybe<Scalars['Int']['output']>;
  isValid?: Maybe<Scalars['Boolean']['output']>;
};

export type Query = {
  __typename?: 'Query';
  login?: Maybe<PlayerStatus>;
  players?: Maybe<Array<Maybe<Player>>>;
};


export type QueryPlayersArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
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
  DarkInfo: ResolverTypeWrapper<DarkInfo>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GameInfo: ResolverTypeWrapper<GameInfo>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Player: ResolverTypeWrapper<Player>;
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
  DarkInfo: DarkInfo;
  Float: Scalars['Float']['output'];
  GameInfo: GameInfo;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Player: Player;
  PlayerStatus: PlayerStatus;
  Query: {};
  Role: Role;
  RoleOrder: RoleOrder;
  String: Scalars['String']['output'];
  Template: Template;
}>;

export type DarkInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['DarkInfo'] = ResolversParentTypes['DarkInfo']> = ResolversObject<{
  actRoleType?: Resolver<Maybe<ResolversTypes['ActRoleType']>, ParentType, ContextType>;
  darkDay?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isStart?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  remainTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  targetList?: Resolver<Maybe<Array<Maybe<ResolversTypes['Player']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GameInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameInfo'] = ResolversParentTypes['GameInfo']> = ResolversObject<{
  chiefId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isVoteFinish?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  updatePlayerPass?: Resolver<Maybe<ResolversTypes['PlayerStatus']>, ParentType, ContextType, RequireFields<MutationUpdatePlayerPassArgs, 'id' | 'pass'>>;
}>;

export type PlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = ResolversObject<{
  chiefVote?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isDie?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isEmpty?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isKill?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isValidCandidate?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isVoteFinish?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  revealedRole?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  roleName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vote?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  votedNumber?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlayerStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlayerStatus'] = ResolversParentTypes['PlayerStatus']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isValid?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  login?: Resolver<Maybe<ResolversTypes['PlayerStatus']>, ParentType, ContextType>;
  players?: Resolver<Maybe<Array<Maybe<ResolversTypes['Player']>>>, ParentType, ContextType, Partial<QueryPlayersArgs>>;
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
  DarkInfo?: DarkInfoResolvers<ContextType>;
  GameInfo?: GameInfoResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  PlayerStatus?: PlayerStatusResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  Template?: TemplateResolvers<ContextType>;
}>;

