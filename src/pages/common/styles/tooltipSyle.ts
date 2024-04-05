import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: '#333333',
    fontSize: '14px',
    fontWeight: 400
  },
  tooltipUpper: {
    backgroundColor: '#333333',
    fontSize: '14px',
    fontWeight: 400,
    marginTop: '20px',
  },
  arrow: {
    "&:before": {
      backgroundColor: '#333333',
    },
  }
}));

export default useStyles