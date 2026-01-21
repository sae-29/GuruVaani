import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Button,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
    Stack,
    Avatar,
} from '@mui/material';
import {
    Search,
    FilterList,
    Visibility,
    Block,
    CheckCircle,
    Refresh,
    School as SchoolIcon,
    AccessTime,
} from '@mui/icons-material';
import api from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import TeacherProfileDialog from '../../components/TeacherProfileDialog';

interface Teacher {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    createdAt: string;
    school: {
        name: string;
        district: string;
        block: string;
    } | null;
    totalReflections: number;
    streakDays: number;
    lastActiveAt?: string;
}

const Teachers: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [district, setDistrict] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
    const [profileOpen, setProfileOpen] = useState(false);

    const fetchTeachers = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                ...(search && { search }),
                ...(role && { role }),
                ...(district && { district }),
            };
            const response = await api.get('/api/users', { params });
            if (response.data.success) {
                setTeachers(response.data.data.users);
                setTotal(response.data.data.pagination.total);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, search, role, district]);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handleRoleChange = (event: any) => {
        setRole(event.target.value);
        setPage(0);
    };

    const handleDistrictChange = (event: any) => {
        setDistrict(event.target.value);
        setPage(0);
    };

    const handleViewProfile = (id: string) => {
        setSelectedTeacherId(id);
        setProfileOpen(true);
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const response = await api.put(`/api/users/${id}/status`, { status: newStatus });
            if (response.data.success) {
                setTeachers(teachers.map(t => t.id === id ? { ...t, status: newStatus } : t));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Chip size="small" icon={<CheckCircle />} label="Active" color="success" variant="outlined" />;
            case 'INACTIVE':
                return <Chip size="small" label="Inactive" color="default" variant="outlined" />;
            case 'SUSPENDED':
                return <Chip size="small" icon={<Block />} label="Suspended" color="error" variant="outlined" />;
            default:
                return <Chip size="small" label={status} variant="outlined" />;
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        Teacher Directory
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage educator profiles, track engagement, and configure access.
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchTeachers}
                    sx={{ borderRadius: 2 }}
                >
                    Refresh
                </Button>
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search by name, email or ID..."
                        value={search}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Role</InputLabel>
                        <Select value={role} label="Role" onChange={handleRoleChange}>
                            <MenuItem value="">All Roles</MenuItem>
                            <MenuItem value="TEACHER">Teacher</MenuItem>
                            <MenuItem value="MENTOR">Mentor</MenuItem>
                            <MenuItem value="PRINCIPAL">Principal</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>District</InputLabel>
                        <Select value={district} label="District" onChange={handleDistrictChange}>
                            <MenuItem value="">All Districts</MenuItem>
                            <MenuItem value="Dehradun">Dehradun</MenuItem>
                            <MenuItem value="Haridwar">Haridwar</MenuItem>
                            <MenuItem value="Nainital">Nainital</MenuItem>
                            <MenuItem value="Almora">Almora</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Paper>

            {/* Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead sx={{ bgcolor: 'grey.50' }}>
                                <TableRow>
                                    <TableCell>Educator</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>School & Region</TableCell>
                                    <TableCell>Last Active</TableCell>
                                    <TableCell align="center">Reflections</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {teachers.map((teacher) => (
                                    <TableRow key={teacher.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 32, height: 32, fontSize: '0.875rem' }}>
                                                    {teacher.firstName[0]}{teacher.lastName[0]}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {teacher.firstName} {teacher.lastName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {teacher.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{teacher.role}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <SchoolIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                <Box>
                                                    <Typography variant="body2">{teacher.school?.name || 'Unassigned'}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {teacher.school?.district || 'N/A'}, {teacher.school?.block || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTime sx={{ fontSize: 16, mr: 1, color: teacher.lastActiveAt ? 'success.main' : 'text.disabled' }} />
                                                <Typography variant="body2" color={teacher.lastActiveAt ? 'text.primary' : 'text.disabled'}>
                                                    {teacher.lastActiveAt
                                                        ? formatDistanceToNow(new Date(teacher.lastActiveAt), { addSuffix: true }).replace('about ', '')
                                                        : 'Never'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2" fontWeight="bold">{teacher.totalReflections}</Typography>
                                            {teacher.streakDays > 0 && (
                                                <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
                                                    🔥 {teacher.streakDays} day streak
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusChip(teacher.status)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="View Profile">
                                                    <IconButton size="small" onClick={() => handleViewProfile(teacher.id)}>
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                {teacher.status === 'ACTIVE' ? (
                                                    <Tooltip title="Deactivate">
                                                        <IconButton size="small" color="error" onClick={() => handleUpdateStatus(teacher.id, 'INACTIVE')}>
                                                            <Block fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Activate">
                                                        <IconButton size="small" color="success" onClick={() => handleUpdateStatus(teacher.id, 'ACTIVE')}>
                                                            <CheckCircle fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={total}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </TableContainer>

            {/* Profile Dialog */}
            <TeacherProfileDialog
                id={selectedTeacherId}
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
            />
        </Box>
    );
};

export default Teachers;
