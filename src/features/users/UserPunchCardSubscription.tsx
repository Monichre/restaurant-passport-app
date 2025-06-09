import {usePunchCardSubscription} from '@/hooks/use-punch-card-subscription'

export const UserPunchCardSubscription = async ({userId}: {userId: string}) => {
  const {punchCards} = usePunchCardSubscription(userId)
  return <div>UserPunchCardSubscription</div>
}
