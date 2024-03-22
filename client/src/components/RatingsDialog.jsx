import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const RatingsDialog = ({ open, onClose, ratings, averageRating }) => {
  const formattedAverageRating =
    typeof averageRating === 'number' ? averageRating.toFixed(1) : 'N/A';
  const ratingsDistribution = Array.from({ length: 5 }, () => 0); // skapar en array med 5 element, alla satta till 0

  // räknar antalet omdömen för varje betyg
  ratings.forEach((ratingObj) => {
    const rating = Math.round(ratingObj.rating); // rundar av till närmaste heltal för enkelhetens skull
    if (rating >= 1 && rating <= 5) {
      ratingsDistribution[rating - 1] += 1; // anpassar index baserat på betyg (1-5)
    }
  });

  const totalRatings = ratings.length;

  return (
    <Dialog onClose={onClose} open={open} maxWidth='sm' fullWidth>
      <DialogTitle>
        Alla omdömen
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant='h4' align='center' gutterBottom>
          {formattedAverageRating}{' '}
          <span role='img' aria-label='star'>
            ⭐
          </span>{' '}
          {totalRatings} omdömen
        </Typography>
        {/* Visa distribution av stjärnbetyg med LinearProgress, korrigera ordningen här */}
        {ratingsDistribution
          .slice()
          .reverse()
          .map((count, index) => (
            <div key={index}>
              <Typography variant='body2'>
                {5 - index}{' '}
                <span role='img' aria-label={`${5 - index} star`}>
                  ⭐
                </span>
              </Typography>
              <LinearProgress
                variant='determinate'
                value={(count / totalRatings) * 100}
              />
              <Typography variant='body2' align='right'>
                {count}
              </Typography>
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default RatingsDialog;