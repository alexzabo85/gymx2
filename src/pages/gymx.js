
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Card,
  CardHeader,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Checkbox,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  List,
  ListItem
} from '@material-ui/core'

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionActions from '@material-ui/core/AccordionActions';

import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// import SessionTable from './sessionTable'


import { useAuth } from "./../util/myAuth.js";
// import { Redirect } from 'react-router-dom';
// import { useUser } from '../util/db.js';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import ProfileCard from "./../components/ProfileCard";

import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
// import Avatar from '@material-ui/core/Avatar';
// import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import { Redirect } from 'react-router-dom';


// import gymxDb from ('../db.json');

const gymxDb = require("../db.json");

// import MyAppBar from '../components/MyAppBar';
// image="../../public/logo192.png" 
// import logo from '../../public/logo192.png'; // Tell webpack this JS file uses this image
// import authHelper from './auth-helper';


const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  table: {
    minWidth: 400,
  },
  avatar: {
    backgroundColor: red[500],
  },

}));

const useStylesTable = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  completeButton: {
    // width: '60%',
    margin: theme.spacing(2),
    justifyContent: 'center'

  },
}));

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));


function Spacer(props) {
  return <div className={props.className}></div>
}

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div" />
      )}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
};


function EnhancedTableHead(props) {
  // eslint-disable-next-line 
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  // eslint-disable-next-line 
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const headCells = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Muscle', size: 'small' },
    { id: 'id', numeric: true, disablePadding: false, label: 'Device', size: 'small' },
    { id: 'id', numeric: true, disablePadding: false, label: 'intensity', size: 'small' },
    { id: 'pattern', numeric: true, disablePadding: false, label: 'Pattern', size: 'small' },
    { id: 'note', numeric: false, disablePadding: false, label: 'Note', size: 'small' },
  ];
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
            disabled
          />
        </TableCell>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={idx}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            size={headCell.size}
          >
            {headCell.label}

            {/* <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel> */}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// function createData(muscle, device, intensity, pattern, note) {
//   // pattern is a string in a form of A:B:C where A is set, B is repetitions, C is rest in seconds
//   // deviceId is a link
//   return { muscle, device, intensity, pattern, note };
// }


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  // onRequestSort: PropTypes.func.isRequired,
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};


function EnhancedTable(props) {
  const auth = useAuth();
  const classes = useStylesTable();
  // const [rows, setRows] = useState(auth.user.programSession[0] || []);
  const [rows, setRows] = useState(gymxDb.users[0].programSession[0]);


  const [selected, setSelected] = React.useState([]);
  // eslint-disable-next-line 
  const [order, setOrder] = React.useState('asc');
  // eslint-disable-next-line 
  const [orderBy, setOrderBy] = React.useState('calories');
  // eslint-disable-next-line 
  const [page, setPage] = React.useState(0);
  // eslint-disable-next-line 
  const [dense, setDense] = React.useState(true);
  // eslint-disable-next-line 
  const [rowsPerPage, setRowsPerPage] = React.useState(rows.length);



  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              // onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {
                // rows
                stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(index);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, index)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.muscle}
                        </TableCell>
                        <TableCell align="right">{row.device}</TableCell>
                        <TableCell align="right">{row.intensity}</TableCell>
                        <TableCell align="right">{row.pattern}</TableCell>
                        <TableCell align="left">{row.note}</TableCell>
                        {/* <TableCell align="right">{row.protein}</TableCell> */}
                      </TableRow>
                    );
                  })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
        <Box textAlign='center'>
          {/* <Button className={classes.completeButton} variant="contained" color="primary"
            onClick={() => { alert('Completed') }}
          >Session Completed
          </Button> */}
          {/* <ProgressBar /> */}
        </Box>
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
}


export default function ProgramPage(props) {
  const classes = useStyles();

  const auth = useAuth();

  const demoUser = gymxDb.users[0];


  /** progress bar functions */
  /** ********************** */
  const useStylesProgressBar = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    button: {
      margin: theme.spacing(1),
      // marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    marginBottom: theme.spacing(10)
  }));

  function getSteps(size) {
    // Returns "A"

    const final = []

    for (let i = 0; i < size; i++) {
      // text += cars[i] + "<br>";
      final.push(String.fromCharCode(65 + i))
    }
    return final;
    // return ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C',];
  }

  function getStepContent(step) {

    return (`Session ${step + 1}`);
    // switch (step) {
    //   case 0:
    //     return 'Session A';
    //   case 1:
    //     return 'Session B';
    //   case 2:
    //     return 'Session C';
    //   default:
    //     return 'Unknown step';
    // }
  }

  function ProgressBar() {
    const classes = useStylesProgressBar();
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const steps = getSteps(3);

    const isStepOptional = (step) => {
      return step === 1;
    };

    const isStepSkipped = (step) => {
      return skipped.has(step);
    };

    const handleNext = () => {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
      if (!isStepOptional(activeStep)) {
        // You probably want to guard against something like this,
        // it should never occur unless someone's actively trying to break something.
        throw new Error("You can't skip a step that isn't optional.");
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped((prevSkipped) => {
        const newSkipped = new Set(prevSkipped.values());
        newSkipped.add(activeStep);
        return newSkipped;
      });
    };

    const handleReset = () => {
      setActiveStep(0);
    };

    return (
      < div className={classes.root} >

        <Stepper activeStep={activeStep}>
          {
            // steps.map((label, index) => {
            steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              // if (isStepOptional(index)) {
              //   labelProps.optional = <Typography variant="caption">Optional</Typography>;
              // }
              // if (isStepSkipped(index)) {
              //   stepProps.completed = false;
              // }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })
          }
        </Stepper>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={1}
          m={1}
          bgcolor="background.paper"
        >


          {activeStep === steps.length ? (
            <Box >
              <Typography className={classes.instructions}>
                Completed
              </Typography>
              {/* <Box Item> */}
              <Button onClick={handleReset} className={classes.button}>
                Reset
              </Button>
              {/* </Box> */}

            </Box>
          ) : (
            <Box >
              <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          )}
        </Box>


      </div >
      // </div >
    );
  }

  /** ********************** */


  const useStylesDetailedAccordion = makeStyles((theme) => ({
    root: {
      // width: theme.spacing(4),
      margin: ''
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    icon: {
      verticalAlign: 'bottom',
      height: 20,
      width: 20,
    },
    details: {
      alignItems: 'center',
    },
    column: {
      flexBasis: '33.33%',
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  }));

  function SessionList2() {
    const classes = useStylesDetailedAccordion();

    const info =
    {
      intensity: "10[kg]",
      repetitions: "10",
      sets: "3",
      rest: "45[sec]",
      note: "do it with a smile",
    }


    return (
      <div className={classes.root}>
        {[1, 1, 1].map((data, idx) => (
          // < >
          <Accordion key={idx} defaultExpanded={false}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1c-content"
              id="panel1c-header"
            >
              <FormControlLabel
                aria-label="Acknowledge"
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
                control={<Checkbox />}
                label="Upper Chest | Device 6"
              />
              {/* <div className={classes.column}>
              <Typography className={classes.heading}>Location</Typography>
  
            </div>
            <div className={classes.column}>
              <Typography className={classes.secondaryHeading}>Select trip destination</Typography>
            </div> */}
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <div className={classes.column} />
              {/* <div className={classes.column}></div> */}
              <Box className={classes.column}>
                {/* <Chip label="Barbados" onDelete={() => { }} /> */}
                <Typography variant="caption" align="right">
                  some extra notes
                </Typography>
              </Box>
              <div className={classes.column}></div>
              <Box className={clsx(classes.column, classes.helper)}>
                {/* <div className={clsx(classes.column, classes.helper)}> */}

                <Typography variant="caption" align="right">
                  <b>Device 6</b>
                </Typography>

                {/* <InteractiveList /> */}
                {/* <ListItemSecondaryAction */}
                <List dense>

                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="intensity" />
                    <ListItemSecondaryAction>
                      <ListItemText primary={info.intensity} />
                    </ListItemSecondaryAction>
                  </ListItem>


                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Repitions" />
                    <ListItemSecondaryAction>
                      <ListItemText primary={info.repetitions} />
                    </ListItemSecondaryAction>
                  </ListItem>


                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Sets" />
                    <ListItemSecondaryAction>
                      <ListItemText primary={info.sets} />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Rest" />
                    <ListItemSecondaryAction>
                      <ListItemText primary={info.rest} />
                    </ListItemSecondaryAction>
                  </ListItem>



                </List>
                {/* <Box textAlign="right">
                <Typography fontSize={16} variant="caption" textAlign="right">
                  <br />
                  10 [kg]
                  <br />
                  15 [repetitions]
                  <br />
                  x3 [sets]
                  <br />
                  <a href="#secondary-heading-and-columns" className={classes.link}>
                    Learn more
                  </a>
                </Typography>
              </Box> */}
              </Box>
            </AccordionDetails>
            <Divider />
            {1 && <AccordionActions>
              <Button size="small">Cancel</Button>
              <Button size="small" color="primary">
                Save
              </Button>
            </AccordionActions>}
          </Accordion >
          // </>
        ))
        }
        {/* <paper elevation={20}>
  
        </paper> */}
      </div >
    );
  }

  // const info = {
  // avatar: "https://uploads.divjoy.com/pravatar-150x-5.jpeg",
  // name: `${auth.user.name || 'name'}`,
  // subtitle: `${auth.user.email}`,
  // title: `Hello ${JSON.stringify(auth.user.email)}`,
  // gender: `${auth.user.gender}`,
  // age: "35",
  // height: "178[cm]",
  // weight: "79[kg]",
  // }

  return (auth.user ?
    <>
      {<ProfileCard
        bgColor="light"
        size="medium"
        bgImage=""
        bgImageOpacity={1}
        // title=
        // info={info}
        // {...info}
        title={`Hello ${JSON.stringify(auth.user.email)} `}
        name={`${auth.user.name || 'no name...'}`}
        avatar={`https://uploads.divjoy.com/pravatar-150x-5.jpeg`}
        gender={`${auth.user.gender}`}
        age={`${auth.user.age || '35'}`}
        height={`${auth.user.height || '178[cm]'}`}
        weight={`${auth.user.weight || '82[kg]'}`}
      />}
      {/* <Spacer className={classes.toolbar} /> */}

      {/* user+program details */}
      <Container maxWidth="sm">
        {null && <Card elevation={12}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                A
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={`${auth.user.name} `}  // "Alex Alexander (M)"
            subheader={`${auth.user.gender} ${auth.user.age} [Y] ${auth.user.height} ${auth.user.weight} `}  // "Alex Alexander (M)"
          />
          {/* <CardMedia
            className={classes.media}
            // image="/static/images/cards/paella.jpg"
            // src
            // image={logo}
            // image="../../../public/logo192.png" import logo from './logo.png'; // Tell webpack this JS file uses this image

            title="Paella dish"
          /> */}
        </Card>}
        <Spacer className={classes.toolbar} />
        <TableContainer component={Paper} elevation={8}>    {/* program details */}
          <Table aria-label="program details">
            <TableHead>
              <TableRow>
                {/* <TableCell colSpan={2} align='center' >{' '}</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(demoUser.programDetails)
                .map((name, idx) => (
                  <TableRow key={idx}>
                    <TableCell component="th" scope="row">
                      <b>{name}</b>
                    </TableCell>
                    <TableCell align="right">{demoUser.programDetails[name]}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Spacer className={classes.toolbar} />

      <Container component={Paper} className={classes.paper} elevation={20} maxWidth="sm">   {/* program details */}
        {/* <paper elevation={20}> */}
        <Spacer className={classes.toolbar} />

        <SessionList2 />
        {/* <EnhancedTable /> */}
        {/* <SessionList /> */}
        <Box alignContent="center">
          <ProgressBar />
        </Box>
        {/* </paper> */}

      </Container>

      <Spacer className={classes.toolbar} />
      {/* <SessionTable2></SessionTable2> */}
    </> : <>
      <Redirect to='/auth/signin' />
    </>
  )
}
