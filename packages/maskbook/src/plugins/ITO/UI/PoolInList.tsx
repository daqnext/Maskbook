import {
    TableContainer,
    Table,
    Paper,
    Card,
    Box,
    createStyles,
    makeStyles,
    Typography,
    LinearProgress,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
} from '@material-ui/core'
import BigNumber from 'bignumber.js'
import ActionButton from '../../../extension/options-page/DashboardComponents/ActionButton'
import { TokenIcon } from '../../../extension/options-page/DashboardComponents/TokenIcon'
import { useI18N } from '../../../utils/i18n-next-ui'
import { formatBalance } from '../../Wallet/formatter'
import { dateTimeFormat } from '../assets/formatDate'
import type { JSON_PayloadInMask } from '../types'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            borderRadius: 10,
            display: 'flex',
            padding: theme.spacing(1),
            margin: theme.spacing(2),
        },
        iconbar: {
            display: 'flex',
            justifyContent: 'center',
            padding: theme.spacing(1),
        },
        icon: {
            width: 32,
            height: 32,
        },
        content: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
        },
        header: {
            display: 'flex',
            paddingBottom: theme.spacing(1),
        },
        button: {
            borderRadius: 50,
        },
        title: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: theme.spacing(1),
        },
        progress: {
            paddingBottom: theme.spacing(1),
        },
        price: {
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom: theme.spacing(1),
        },
        deteils: {
            deisplay: 'flex',
            flexDirection: 'column',
            '& > *': {
                paddingBottom: theme.spacing(1),
            },
        },
        table: {
            paddingBottom: theme.spacing(1),
            borderRadius: 0,
        },
        cell: {
            border: '1px solid rgba(224, 224, 224, 1)',
            color: theme.palette.text.primary,
        },
        table_title: {
            border: '1px solid rgba(224, 224, 224, 1)',
            color: theme.palette.text.secondary,
        },
    }),
)

interface PoolInListProps {
    pool: JSON_PayloadInMask
    index: number
    onSend?: (pool: JSON_PayloadInMask) => void
    onWithdraw?: (payload: JSON_PayloadInMask) => void
}

function PoolInList(props: PoolInListProps) {
    const classes = useStyles()
    const { t } = useI18N()
    const { pool, onSend, onWithdraw } = props

    const progress =
        100 *
        Number(new BigNumber(pool.total).minus(new BigNumber(pool.total_remaining)).div(new BigNumber(pool.total)))

    const StatusButton = () => {
        const start = pool.start_time * 1000
        const end = pool.end_time * 1000
        const now = Date.now()
        const noRemain = new BigNumber(pool.total_remaining).isZero()
        return (
            <>
                {now <= end ? (
                    <ActionButton size="small" variant="contained" disabled={noRemain} onClick={() => onSend?.(pool)}>
                        {now < start
                            ? t('plugin_ito_list_button_send')
                            : noRemain
                            ? t('plugin_ito_list_button_claim')
                            : t('plugin_ito_list_button_send')}
                    </ActionButton>
                ) : (
                    <ActionButton
                        size="small"
                        variant="contained"
                        disabled={noRemain}
                        onClick={() => onWithdraw?.(pool)}>
                        {t('plugin_ito_list_button_claim')}
                    </ActionButton>
                )}
            </>
        )
    }
    return (
        <Card className={classes.root} variant="outlined">
            <Box className={classes.iconbar}>
                <TokenIcon classes={{ icon: classes.icon }} address={pool.token.address} />
            </Box>
            <Box className={classes.content}>
                <Box className={classes.header}>
                    <Box className={classes.title}>
                        <Typography variant="body1" color="textPrimary">
                            {pool.message}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {t('plugin_ito_list_end_date', {
                                date: dateTimeFormat(new Date(pool.end_time * 1000)),
                            })}
                        </Typography>
                    </Box>
                    <Box className={classes.button}>
                        <StatusButton />
                    </Box>
                </Box>
                <Box className={classes.progress}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>

                <Box className={classes.price}>
                    <Typography variant="body2" color="textSecondary" component="span">
                        {t('plugin_ito_list_sold_total')}
                        <Typography variant="body2" color="textPrimary" component="span">
                            {formatBalance(
                                new BigNumber(pool.total).minus(new BigNumber(pool.total_remaining)),
                                pool.token.decimals ?? '0',
                            )}
                        </Typography>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="span">
                        {t('plugin_ito_list_total')}
                        <Typography variant="body2" color="textPrimary" component="span">
                            {formatBalance(new BigNumber(pool.total), pool.token.decimals ?? 0)}
                        </Typography>{' '}
                        {pool.token.symbol}
                    </Typography>
                </Box>

                <Box className={classes.deteils}>
                    <Typography variant="body2" color="textSecondary">
                        {t('plugin_ito_list_sold_details')}
                    </Typography>
                    <TableContainer component={Paper} className={classes.table}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.table_title} align="center" size="small">
                                        {t('plugin_ito_list_table_type')}
                                    </TableCell>
                                    <TableCell className={classes.table_title} align="center" size="small">
                                        {t('plugin_ito_list_table_price')}
                                    </TableCell>
                                    <TableCell className={classes.table_title} align="center" size="small">
                                        {t('plugin_ito_list_table_sold', { token: pool.token.symbol })}
                                    </TableCell>
                                    <TableCell className={classes.table_title} align="center" size="small">
                                        {t('plugin_ito_list_table_got')}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pool.exchange_tokens.map((token, index) => (
                                    <TableRow>
                                        <TableCell className={classes.cell} align="center" size="small">
                                            {token.symbol}
                                        </TableCell>
                                        <TableCell className={classes.cell} align="center" size="small">
                                            {pool.exchange_amounts[index]} {token.symbol} / {pool.token.symbol}
                                        </TableCell>
                                        <TableCell className={classes.cell} align="center" size="small">
                                            {formatBalance(
                                                new BigNumber(pool.exchange_volumes[0] ?? 0),
                                                pool.token.decimals ?? 0,
                                            )}
                                        </TableCell>
                                        <TableCell className={classes.cell} align="center" size="small">
                                            {formatBalance(
                                                new BigNumber(pool.exchange_volumes[1] ?? 0),
                                                pool.token.decimals ?? 0,
                                            )}{' '}
                                            {token.symbol}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Card>
    )
}

export interface PoolsInListProps {
    index: number
    data: {
        pools: JSON_PayloadInMask[]
        onSend?: (pool: JSON_PayloadInMask) => void
        onWithdraw?: (payload: JSON_PayloadInMask) => void
    }
}

export function PoolsInList(props: PoolsInListProps) {
    const { pools, onSend, onWithdraw } = props.data
    return (
        <>
            {pools.map((pool, index) => (
                <PoolInList pool={pool} onSend={onSend} onWithdraw={onWithdraw} key={pool.pid} index={index} />
            ))}
        </>
    )
}
