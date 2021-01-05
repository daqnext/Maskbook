import { makeStyles, createStyles, Card, Typography, Button, ButtonGroup, Grid, Avatar, Icon, SvgIconProps, SvgIcon } from '@material-ui/core'
import { useI18N } from '../../../utils/i18n-next-ui'
import { useGrant } from '../hooks/useGrant'
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder'
const useStyles = makeStyles((theme) => createStyles({
    root: {
        padding: theme.spacing(1),
    },
    logo: {
        padding: theme.spacing(4),
        textAlign: 'center',
        "& > *": {
            width: 100,
            height: 100,
        },
    },
    title: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        "& > :last-child": {
            marginTop: 4,
            marginLeft: 4,
        }
    },
    description: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    update: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        display: 'flex',
        flexDirection: 'row',
        "& > * ": {
            marginLeft: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
      },
    buttons: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        "& > *": {
            justifyContent: 'center',
            textAlign: 'center',
            "& > *": {
                width: 150,
            },
        },

    },
    verified: {
        borderRadius: 50,
    },
    text: {
        overflow : 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': '4',
        '-webkit-box-orient': 'vertical',
    },
}))

interface PreviewCardProps {
    id: string
    onRequest(): void
}

export const VerifiedIcon: React.FC = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="18" height="18" rx="9" fill="#1C68F3"/>
            <path d="M13 7L7.5 12L5 9.72727" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    </SvgIcon>
)

export function PreviewCard(props: PreviewCardProps) {
    const { t } = useI18N()
    const classes = useStyles()
    const { value: grant, error, loading } = useGrant(props.id)

    if (loading) return <h1>Loading...</h1>
    if (error) return <h1>ERROR</h1>
    if (!grant) return null

    return (
        <Card variant="outlined" className={classes.root} elevation={0}>
            <div className={classes.logo}>
                <img src={grant.logo_url} />
            </div>

            <div className={classes.title}>
                <Typography variant='h6' color='textPrimary'>
                    {grant.title}
                </Typography>
                {/*
                <Icon color="primary" fontSize="small">check_circle</Icon>
                */}
                {grant.verified ? (<VerifiedIcon />) : null}
            </div>
            <div className={classes.description}>
                <Typography variant='body1' color='textSecondary' className={classes.text}>
                    {grant.description}
                </Typography>
            </div>
            <div className={classes.update}>
                <QueryBuilderIcon fontSize='small' color='disabled' />
                <Typography variant='body1' color='textSecondary'>
                   Last update: {grant.last_update_natural}
                </Typography>
            </div>

            <div className={classes.avatar}>
                <Typography variant='body2'>
                    By
                </Typography>
                <Avatar alt={grant.admin_profile.handle} src={grant.admin_profile.avatar_url} className={classes.small}/>
                <Typography variant='body2'>
                    {grant.admin_profile.handle}
                </Typography>
            </div>


            <Grid container className={classes.buttons} spacing={2}>
                <Grid item xs={6} >
                    <Button variant="outlined" color="primary">View on Gitcoin</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" color="primary">Donate</Button>
                </Grid>
            </Grid>

        </Card>
    )
}
