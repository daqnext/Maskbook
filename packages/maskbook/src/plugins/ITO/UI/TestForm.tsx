import { useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { v4 as uuid } from 'uuid'
import ActionButton from '../../../extension/options-page/DashboardComponents/ActionButton'
import { useFillCallback } from '../hooks/useFillCallback'
import type { ITO_JSONPayload } from '../types'
import { useChainId } from '../../../web3/hooks/useChainState'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core'
import { useAccount } from '../../../web3/hooks/useAccount'
import { resolveChainName } from '../../../web3/pipes'
import { useERC20TokenDetailed } from '../../../web3/hooks/useERC20TokenDetailed'
import { ApproveState, useERC20TokenApproveCallback } from '../../../web3/hooks/useERC20TokenApproveCallback'
import { useConstant } from '../../../web3/hooks/useConstant'
import { ITO_CONSTANTS } from '../constants'

export interface TestFormProps {
    onCreate?: (payload: ITO_JSONPayload) => void
}

export function TestForm(props: TestFormProps) {
    const account = useAccount()
    const chainId = useChainId()

    const ITO_CONTRACT_ADDRESS = useConstant(ITO_CONSTANTS, 'ITO_CONTRACT_ADDRESS')

    const { value: MaskbookA } = useERC20TokenDetailed('0x960B816d6dD03eD514c03F56788279154348Ea37')
    const { value: MaskbookB } = useERC20TokenDetailed('0xFa4Bddbc85c0aC7a543c4b59dCfb5deB17F67D8E')
    const { value: MaskbookC } = useERC20TokenDetailed('0xbE88c0E7029929f50c81690275395Da1d05745B0')

    const settings = useMemo(() => {
        const today = new Date()
        const tomorrow = new Date()
        tomorrow.setDate(today.getDate() + 1)
        return {
            name: 'Mask',
            title: 'Test ITO Packet',
            password: uuid(),
            limit: new BigNumber(10).toFixed(),
            total: new BigNumber(100).toFixed(),
            startTime: today,
            endTime: tomorrow,
            exchangeAmounts: [new BigNumber(1000).toFixed(), new BigNumber(10000).toFixed()],
            exchangeTokens: MaskbookB && MaskbookC ? [MaskbookB, MaskbookC] : [],
            token: MaskbookA,
        }
    }, [chainId, MaskbookA, MaskbookB, MaskbookC])

    //#region blocking
    const [approveState, approveCallback, resetApproveCallback] = useERC20TokenApproveCallback(
        MaskbookA?.address ?? '',
        '100',
        ITO_CONTRACT_ADDRESS,
    )
    const [fillSettings, fillState, fillCallback, resetFillCallback] = useFillCallback(settings)
    const onCreate = useCallback(async () => {
        if (approveState !== ApproveState.NOT_APPROVED) await approveCallback()
        await fillCallback()
    }, [approveState, settings])
    const onReset = useCallback(() => {
        resetApproveCallback()
        resetFillCallback()
    }, [])
    //#endregion

    return (
        <div>
            <Accordion elevation={0}>
                <AccordionSummary>
                    <Typography>Context</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <pre>
                        {JSON.stringify(
                            {
                                account,
                                chainName: resolveChainName(chainId),
                            },
                            null,
                            2,
                        )}
                    </pre>
                </AccordionDetails>
            </Accordion>
            <Accordion elevation={0}>
                <AccordionSummary>
                    <Typography>Status</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <pre>
                        {JSON.stringify(
                            {
                                approveState,
                                fillState,
                                fillSettings,
                            },
                            null,
                            2,
                        )}
                    </pre>
                </AccordionDetails>
            </Accordion>
            <Accordion elevation={0}>
                <AccordionSummary>
                    <Typography>Pool Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <pre>{JSON.stringify(settings, null, 2)}</pre>
                </AccordionDetails>
            </Accordion>

            <ActionButton onClick={onCreate}>Create</ActionButton>
            <ActionButton onClick={onReset}>Reset</ActionButton>
        </div>
    )
}
