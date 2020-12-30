import { CircularProgress, createStyles, makeStyles, Typography, Box } from '@material-ui/core'
import { useAccount } from '../../../web3/hooks/useAccount'
import { useTransactionDialog } from '../../../web3/hooks/useTransactionDialog'
import { useAllPoolsAsSeller } from '../hooks/useAllPoolsAsSeller'
import { useDestructCallback } from '../hooks/useDestructCallback'
import type { JSON_PayloadInMask } from '../types'
import { PoolInList } from './PoolInList'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            justifyItems: 'center',
            alignItems: 'center',
        },
        list: {
            width: '100%',
            overflow: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
    }),
)
export interface PoolListProps {
    onSend: (payload: JSON_PayloadInMask) => void
}

export function PoolList(props: PoolListProps) {
    const classes = useStyles()
    const account = useAccount()
    const { value: pools = [], loading, retry } = useAllPoolsAsSeller(account)

    //#region withdraw
    const [destructState, destructCallback, resetDestructCallback] = useDestructCallback()
    useTransactionDialog({}, destructState, () => {
        retry()
        resetDestructCallback()
    })
    //#endregion

    return (
        <>
            {loading ? (
                <Box className={classes.root}>
                    <CircularProgress />
                </Box>
            ) : pools.length === 0 ? (
                <Typography variant="body1" color="textSecondary" className={classes.root}>
                    No Data
                </Typography>
            ) : (
                <div className={classes.list}>
                    {pools.map((x) => (
                        <PoolInList
                            {...x}
                            onSend={props.onSend}
                            onWithdraw={(payload: JSON_PayloadInMask) => {
                                destructCallback(payload.pid)
                            }}
                        />
                    ))}
                </div>
            )}
        </>
    )
}
