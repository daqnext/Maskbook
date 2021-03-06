import { createStyles, makeStyles, Typography, Box } from '@material-ui/core'
import ActionButton from '../../../extension/options-page/DashboardComponents/ActionButton'
import type { ERC20TokenDetailed, EtherTokenDetailed } from '../../../web3/types'
import type BigNumber from 'bignumber.js'
import { useStylesExtends } from '../../../components/custom-ui-helper'
import { useI18N } from '../../../utils/i18n-next-ui'
import { formatBalance } from '../../../plugins/Wallet/formatter'
import { usePostLink } from '../../../components/DataSource/usePostInfo'
import { useShareLink } from '../../../utils/hooks/useShareLink'
import { getAssetAsBlobURL } from '../../../utils/suspends/getAssetAsBlobURL'

const useStyles = makeStyles((theme) =>
    createStyles({
        shareWrapper: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: theme.spacing(2, 0),
        },
        shareAmount: {
            fontSize: 36,
            marginTop: 90,
            color: '#fff',
        },
        shareToken: {
            marginTop: 5,
            fontSize: 24,
            color: '#fff',
        },
        shareText: {
            marginTop: 20,
            fontSize: 24,
            color: '#fff',
        },
        shareButton: {
            width: 'fit-content',
            backgroundColor: '#FBD363 !important',
            padding: theme.spacing(0.5, 6),
            marginTop: theme.spacing(2),
            minHeight: 28,
        },
        shareImage: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundAttachment: 'local',
            backgroundPosition: '0',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: 475,
            height: 341,
            backgroundColor: '#332C61',
            borderRadius: 10,
        },
    }),
)

export interface ShareDialogProps extends withClasses<'root'> {
    token: EtherTokenDetailed | ERC20TokenDetailed
    actualSwapAmount: BigNumber
    poolName: string
    onClose: () => void
}

export function ShareDialog(props: ShareDialogProps) {
    const ShareBackground = getAssetAsBlobURL(new URL('../assets/share-background.jpg', import.meta.url))
    const { t } = useI18N()
    const classes = useStylesExtends(useStyles(), {})
    const { token, actualSwapAmount } = props
    const postLink = usePostLink()
    const amount = formatBalance(actualSwapAmount, token.decimals ?? 0)
    const shareLink = useShareLink(
        t('plugin_ito_claim_success_share', {
            link: postLink,
            symbol: token.symbol,
        }),
    )
    return (
        <>
            <Box className={classes.shareWrapper}>
                <div className={classes.shareImage} style={{ backgroundImage: `url(${ShareBackground})` }}>
                    <Typography variant="body1" className={classes.shareAmount}>
                        {amount}
                    </Typography>
                    <Typography variant="body1" className={classes.shareToken}>
                        {token.symbol}
                    </Typography>
                    <Typography variant="body1" className={classes.shareText}>
                        {t('plugin_ito_congratulations')}
                    </Typography>
                    <ActionButton
                        onClick={() => {
                            props.onClose()
                            window.open(shareLink, '_blank', 'noopener noreferrer')
                        }}
                        variant="contained"
                        color="primary"
                        className={classes.shareButton}>
                        {t('plugin_ito_dialog_claim_share_title')}
                    </ActionButton>
                </div>
            </Box>
        </>
    )
}
