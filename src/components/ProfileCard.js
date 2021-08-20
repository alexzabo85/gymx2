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
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

function ProfileCard(props) {
  const classes = useStyles();

  const items = [
    {
      avatar: "https://uploads.divjoy.com/pravatar-150x-5.jpeg",
      name: "Sarah Kline",
      gender: "Female",
      age: "35",
      height: "178[cm]",
      weight: "79[kg]",

    },

  ];

  return (
    <Section
      bgColor={props.bgColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <SectionHeader
          title={'User Details'}
          subtitle={props.info.subtitle}
          size={4}
          textAlign="center"
        />
        <Grid container={true} justify="center" spacing={4}>
          {items.map((item, index) => (
            <Grid item={true} xs={12} sm={4} key={index}>
              <>
                <Card>

                  <Box display="flex" justifyContent="center" pt={3}>
                    <Avatar
                      src={item.avatar}
                      alt={item.name}
                      className={classes.avatar}
                    />
                  </Box>

                  <CardContent>
                    <Box textAlign="center">
                      <Box mt={3}>
                        {/* <Typography color="textSecondary" variant="body2" component="p">
                        {item.name}
                      </Typography> */}
                        <Typography variant="body1" color="textPrimary" component="p">
                          {item.gender} {item.age}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          {item.company}
                        </Typography>
                        <Typography variant="body1" color="textPrimary" component="p">
                          {item.height} / {item.weight}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </>
            </Grid>
          ))}
        </Grid>

        <PersonalMeter />
      </Container>
    </Section>
  );
}

export default ProfileCard;
