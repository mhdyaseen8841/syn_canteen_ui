import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import { Delete, MoreVert,AddCircle, Cancel, Preview, Settings } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 130,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

export default function TableActionButton({ data, actions = ['Edit', 'Delete'], onActionChange }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (action) => {
        setAnchorEl(null);
        onActionChange && onActionChange({ action, data })
    };

    return (
        <div>
            <IconButton
                variant="contained"
                onClick={handleClick}
            >
                <MoreVert />
            </IconButton>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {
                    actions.map((item, ind) => {
                         if (item.toUpperCase() == "ADD TO QUEUE") {
                            return (
                                <MenuItem key={ind} onClick={() => handleClose(item)}
                                sx={{
                                    color: 'green',         // Change text color to red
                                    '&:hover': {
                                      backgroundColor: 'rgba(72, 113, 247, 0.1)', // Change background color on hover
                                    },
                                  }}>
                                    <AddCircle style={{ color: "green" }}  />
                                    Add To Queue
                                </MenuItem>
                            )
                        }
                        else if (item.toUpperCase() == "ADDBOOKING") {
                            return (
                                <MenuItem key={ind} onClick={() => handleClose(item)}
                                sx={{
                                    color: 'green',         // Change text color to red
                                    '&:hover': {
                                      backgroundColor: 'rgba(72, 113, 247, 0.1)', // Change background color on hover
                                    },
                                  }}>
                                    <AddCircle style={{ color: "green" }}  />
                                    Add TO BOOKING
                                </MenuItem>
                            )
                        }
                        else if (item.toUpperCase() == "EDIT") {
                            return (
                                <MenuItem key={ind} onClick={() => handleClose(item)}>
                                    <EditIcon />
                                    Edit
                                </MenuItem>
                            )
                        } else if (item.toUpperCase() == "DELETE") {
                            return (
                                <MenuItem  key={ind} onClick={() => handleClose(item)} 
                                sx={{
                                    color: 'red',        
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                    },
                                  }}
                                    >
                                    <Delete style={{ color: "red" }} />
                                    Delete
                                </MenuItem>
                            )
                        } else if (item.toUpperCase() == "VIEW") {
                            return (
                                <MenuItem key={ind} onClick={() => handleClose(item)}>
                                    <Preview />
                                    View
                                </MenuItem>
                            )
                        }
                       
                        else if (item.toUpperCase() == "CANCEL") {
                            return (
                                <MenuItem sx={{color:'red'}}  key={ind} onClick={() => handleClose(item)}>
                                    <Cancel color="primary"  style={{ color: 'red' }} />
                                    Cancel
                                </MenuItem>
                            )
                        } else {
                            return (
                                <MenuItem key={ind} onClick={() => handleClose(item)} >
                                    <Settings />
                                    {item}
                                </MenuItem>
                            )
                        }

                    })
                }
            </StyledMenu>
        </div>
    );
}