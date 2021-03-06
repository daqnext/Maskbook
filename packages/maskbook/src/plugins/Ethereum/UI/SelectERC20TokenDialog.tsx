import { useState } from 'react'
import { makeStyles, createStyles, Theme, DialogContent, TextField } from '@material-ui/core'
import { InjectedDialog } from '../../../components/shared/InjectedDialog'
import { useI18N } from '../../../utils/i18n-next-ui'
import { useStylesExtends } from '../../../components/custom-ui-helper'
import { FixedTokenList } from '../../../extension/options-page/DashboardComponents/FixedTokenList'
import type { ERC20TokenDetailed } from '../../../web3/types'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        search: {
            width: '100%',
            margin: theme.spacing(1, 0, 2),
        },
        list: {
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
        placeholder: {
            textAlign: 'center',
            height: 288,
            paddingTop: theme.spacing(14),
            boxSizing: 'border-box',
        },
    }),
)

export interface SelectERC20TokenDialogProps extends withClasses<never> {
    open: boolean
    includeTokens: string[]
    excludeTokens: string[]
    selectedTokens: string[]
    disableSearchBar?: boolean
    onSubmit(token: ERC20TokenDetailed): void
    onClose(): void
}

export function SelectERC20TokenDialog(props: SelectERC20TokenDialogProps) {
    const { t } = useI18N()
    const classes = useStylesExtends(useStyles(), props)

    const { open, disableSearchBar = false, includeTokens, excludeTokens, selectedTokens, onSubmit, onClose } = props

    //#region search tokens
    const [keyword, setKeyword] = useState('')
    //#endregion

    return (
        <InjectedDialog open={open} onClose={onClose} title="Select a Token" DialogProps={{ maxWidth: 'xs' }}>
            <DialogContent>
                {!disableSearchBar ? (
                    <TextField
                        className={classes.search}
                        label={t('add_token_search_hint')}
                        autoFocus
                        fullWidth
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                ) : null}
                <FixedTokenList
                    classes={{ list: classes.list, placeholder: classes.placeholder }}
                    useEther
                    keyword={keyword}
                    includeTokens={includeTokens}
                    excludeTokens={excludeTokens}
                    selectedTokens={selectedTokens}
                    onSubmit={onSubmit}
                    FixedSizeListProps={{
                        height: disableSearchBar ? 350 : 288,
                        itemSize: 52,
                        overscanCount: 4,
                    }}
                />
            </DialogContent>
        </InjectedDialog>
    )
}
