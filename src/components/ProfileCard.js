import React from "react";
import Section from "./Section";
import Container from "@material-ui/core/Container";
import SectionHeader from "./SectionHeader";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PersonalMeter from "./personalMeter";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,

  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },

}));

function ProfileCard(props) {
  const classes = useStyles();

  // const items = [
  //   {
  //     avatar: "https://uploads.divjoy.com/pravatar-150x-5.jpeg",
  //     name: "Sarah Kline",
  //     gender: "Female",
  //     age: "35",
  //     height: "178[cm]",
  //     weight: "79[kg]",
  //   },
  // ];

  return (
    <Section
      bgColor={props.bgColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <SectionHeader
          // title={props.subtitle}
          title={'User Details'}
          size={4}
          textAlign="center"
        />
        <Grid container justify="center" spacing={4}>
          {/* {items.map((item, index) => ( */}
          <Grid item xs={12} sm={6} >
            <>
              <Card>

                <Box display="flex" justifyContent="center" pt={3}>
                  <Avatar
                    src={props.avatar}
                    alt={props.name}
                    className={classes.avatar}
                  />
                </Box>

                <CardContent>
                  <Box textAlign="center">
                    <Box mt={3}>
                      <Typography color="textSecondary" variant="body2" component="p">
                        {props.name}
                      </Typography>
                      <Typography variant="body1" color="textPrimary" component="p">
                        {props.gender} {props.age}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {props.company}
                      </Typography>
                      <Typography variant="body1" color="textPrimary" component="p">
                        <b>
                          {props.height} / {props.weight}
                        </b>
                      </Typography>
                    </Box>
                  </Box>
                  <Spacer className={classes.toolbar} />
                </CardContent>
              </Card>
            </>
          </Grid>
          <Grid item xs={12} sm={6} >
            <>
              <Card>
                <CardContent>
                  <Box textAlign="center">
                    <Box mt={4}>
                      {/* <Typography color="textSecondary" variant="body2" component="p">
                        {props.name}
                      </Typography>
                      <Typography variant="body1" color="textPrimary" component="p">
                        {props.gender} {props.age}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {props.company}
                      </Typography>
                      <Typography variant="body1" color="textPrimary" component="p">
                        <b>{props.height} / {props.weight}</b>
                      </Typography> */}

                      <PersonalMeter />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </>
          </Grid>
        </Grid>
      </Container>
    </Section>
  );
}

function Spacer(props) {
  return <div className={props.className}></div>
}

export default ProfileCard;
