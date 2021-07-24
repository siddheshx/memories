import React, { useEffect } from 'react'
import { Pagination, PaginationItem } from "@material-ui/lab";

import useStyles from "./styles";
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getPostsAsync } from '../slices/posts';

type PaginationProps = {
    page: string
}

const Paginate= ({ page }: PaginationProps) => {
    const classes = useStyles();
    const disptach = useAppDispatch();
    const { numberOfPages } = useAppSelector((state) => state.posts);

    useEffect(() => {
        if(page) {
            disptach(getPostsAsync(page));
        }else{

        }
        // eslint-disable-next-line
    }, [page]);

    return (
        <Pagination 
            classes={{ ul: classes.ul }}
            count={numberOfPages}
            page={Number(page) || 1}
            variant="outlined"
            color="primary"
            renderItem={(item) => (
                <PaginationItem {...item} component={Link} to={`/posts?page=${item.page}`} />
            )}
        />
    )
}

export default Paginate
