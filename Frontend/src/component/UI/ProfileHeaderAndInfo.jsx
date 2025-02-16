import React, { useEffect, useState } from 'react';
import {
  Paper,
  Avatar,
  Typography,
  Grid,
  IconButton,
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Button,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from 'react-hook-form';

import { useLocation } from 'react-router-dom';

const ProfileHeaderAndInfo = ({ givenUser }) => {
  const [isEditable, setIsEditable] = useState(false);
 
  const { register, handleSubmit, formState: { errors }, watch, setValue ,reset } = useForm({
    defaultValues: {
      first_name: givenUser.first_name,
      last_name: givenUser.last_name,
      email: givenUser.email,
      city: givenUser.city,
      gender: givenUser.gender,
    },
  });

  const firstname = watch("first_name");
  const lastname = watch("last_name");

  const onSubmit = (data) => {
    dispatch(updateUser({ ...data,_id: givenUser?._id }));
    setIsEditable(false);
  };


  
  useEffect(() => {
    reset({
      first_name: givenUser.first_name,
      last_name: givenUser.last_name,
      email: givenUser.email,
      city: givenUser.city,
      gender: givenUser.gender,
      role: givenUser.role
    });
  }, [givenUser, reset]);
  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };
  
  return (
    <Paper elevation={3} sx={{ mb: 4, paddingBlock: 5 }}>
      <Box
        sx={{
          backgroundImage: 'url(/images/profile-banner.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '150px',
          borderRadius: '8px 8px 0 0',
        }}
      />
      <Box sx={{ textAlign: 'center', mt: '-50px' }}>
      
        <Typography variant="h5" sx={{ mt: 2 }} className="capitalize">
          {`${firstname} ${lastname}`} <span style={{ color: 'red' }}>{`(${givenUser?.role})`}</span>
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Personal Info</Typography>
          <IconButton aria-label="edit" onClick={handleEditClick}>
            {isEditable ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />
        <form onSubmit={handleSubmit(onSubmit)}>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <Typography variant="subtitle2">First Name:</Typography>
      {isEditable ? (
        <TextField
          {...register("first_name", { required: "First name is required" })}
          fullWidth
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
        />
      ) : (
        <Typography variant="body1" className="normal-case">
          {watch("first_name")}
        </Typography>
      )}
    </Grid>

    <Grid item xs={12} sm={6}>
      <Typography variant="subtitle2">Last Name:</Typography>
      {isEditable ? (
        <TextField
          {...register("last_name", { required: "Last name is required" })}
          fullWidth
          error={!!errors.last_name}
          helperText={errors.last_name?.message}
        />
      ) : (
        <Typography variant="body1">{watch("last_name")}</Typography>
      )}
    </Grid>

    <Grid item xs={12} sm={6}>
      <Typography variant="subtitle2">City:</Typography>
      {isEditable ? (
        <TextField
          {...register("city")}
          fullWidth
        />
      ) : (
        <Typography variant="body1">{watch("city") || '-'}</Typography>
      )}
    </Grid>

    <Grid item xs={12} sm={6}>
      <Typography variant="subtitle2">Gender:</Typography>
      {isEditable ? (
        <RadioGroup
          value={watch("gender")}
          onChange={(e) => setValue("gender", e.target.value)}
          row
        >
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
          <FormControlLabel value="Other" control={<Radio />} label="Other" />
        </RadioGroup>
      ) : (
        <Typography variant="body1">{watch("gender") || '-'}</Typography>
      )}
    </Grid>

    {/* Role Field */}
   { <Grid item xs={12} sm={6}>
  <Typography variant="subtitle2">Role:</Typography>
  {isEditable ? (
    <TextField
      select
     
      value={watch("role")}
      onChange={(e) => setValue("role", e.target.value)}
      fullWidth
      variant="outlined"
    >
      <MenuItem value="Admin">Admin</MenuItem>
      <MenuItem value="Organizer">Organizer</MenuItem>
      <MenuItem value="Attendee">Attendee</MenuItem>
    </TextField>
  ) : (
    <Typography variant="body1">{watch("role") || '-'}</Typography>
  )}
</Grid>}
  </Grid>

  {isEditable && (
    <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
      <Button variant="contained" color="primary" type="submit">
        Save
      </Button>
    </Grid>
  )}
</form>

      </Box>
    </Paper>
  );
};

export default ProfileHeaderAndInfo;
