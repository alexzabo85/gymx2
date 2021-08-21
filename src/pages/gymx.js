
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
import Model, { IExerciseData, IMuscleStats } from 'react-body-highlighter';

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

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
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
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  // onRequestSort: PropTypes.func.isRequired,
};

// /* Back */
// trapezius
// upper-back
// lower-back

// /* Chest */
// chest

// /* Arms */
// biceps
// triceps
// forearm
// back-deltoids
// front-deltoids

// /* Abs */
// abs
// obliques

// /* Legs */
// adductor
// hamstring
// quadriceps
// abductors
// calves
// gluteal

// /* Head */
// head
// neck


function HumanBodyPanel() {
  const data = [
    { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
    { name: 'Push Ups', muscles: ['chest'] },
  ];

  const handleClick = React.useCallback(({ muscle, data }) => {
    const { exercises, frequency } = data;

    alert(`You clicked the ${muscle}! You've worked out this muscle ${frequency} times through the following exercises: ${JSON.stringify(exercises)}`)

  }, [data]);

  return (
    <Model
      data={data}
      style={{ width: '20rem', padding: '5rem' }}
      onClick={handleClick}
    />
  );
}

export default function ProgramPage(props) {
  const classes = useStyles();

  const auth = useAuth();

  // const auth.user = gymxDb.users[0];


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
      flexBasis: '100.0%',
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      // padding: theme.spacing(1, 1),
    },
    bodyPanel: {
      border: '1px solid',
      // borderLeft: `2px solid ${theme.palette.divider}`,
      // padding: theme.spacing(3, 3),
      // padding: '5'
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

    const list = auth.user.programSession[0]
    console.log(list)


    return (
      <div className={classes.root}>
        {list.map((step, idx) => (
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
                // label="Upper Chest | Device 6"
                label={`D${step.device} | ${step.muscle}`}
              />
              {/* <div className={classes.column}>
              <Typography className={classes.heading}>Location</Typography>
  
            </div>
            <div className={classes.column}>
              <Typography className={classes.secondaryHeading}>Select trip destination</Typography>
            </div> */}
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              {/* <div className={classes.column} /> */}
              {/* <div className={classes.column}></div> */}
              {/* <Box className={classes.column}>
                <Typography variant="caption" align="right">
                  some extra notes
                </Typography>
              </Box>
              <div className={classes.column}></div> */}
              <div className={classes.root}>
                <Grid container spacing={3}>

                  <Grid item xs={12}>
                    <Box className={clsx(classes.column, classes.helper)}>
                      {/* <div className={clsx(classes.column, classes.helper)}> */}

                      <Typography variant="caption" align="right">
                        <b>{`Device D${step.device}`}</b>
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
                            <ListItemText primary={step.intensity} />
                          </ListItemSecondaryAction>
                        </ListItem>


                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <FolderIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary="Rep'" />
                          <ListItemSecondaryAction>
                            <ListItemText primary={step.pattern} />
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
                            <ListItemText primary={step.pattern} />
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
                            <ListItemText primary={step.pattern} />
                          </ListItemSecondaryAction>
                        </ListItem>



                      </List>
                    </Box>

                  </Grid>
                  <Grid item xs={12}>
                    <HumanBodyPanel ></HumanBodyPanel>
                  </Grid>
                </Grid>
              </div>
              {/* <div className={classes.column}></div> */}
            </AccordionDetails>
            <Divider />
            {
              1 && <AccordionActions>
                <Button size="small">Cancel</Button>
                <Button size="small" color="primary">
                  Save
                </Button>
              </AccordionActions>
            }
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

  return (!auth.user ? <> <Redirect to='/auth/signin' />  </> : <>
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
      age={`${auth.user.age || '__[y]'}`}
      height={`${auth.user.height || '__[cm]'}`}
      weight={`${auth.user.weight || '__[kg]'}`}
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
            {Object.keys(auth.user.programDetails)
              .map((name, idx) => (
                <TableRow key={idx}>
                  <TableCell component="th" scope="row">
                    <b>{name}</b>
                  </TableCell>
                  <TableCell align="right">{auth.user.programDetails[name]}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    <Spacer className={classes.toolbar} />

    {/* programSession */}
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

  </>)
}
