import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button, Image, Col, Row, Container } from "react-bootstrap";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../API/axiosDefaults";
import { useProfileData, useSetProfileData } from "../../contexts/ProfileDataContext";
import Asset from "../../components/Asset";
import PopularProfiles from "./PopularProfiles";
import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results-icon.png";

function ProfilePage() {
    const [hasLoaded, setHasLoaded] = useState(false);
    const [profilePosts, setProfilePosts] = useState({ results: [] });
    const currentUser = useCurrentUser();
    const { id } = useParams();
    const setProfileData = useSetProfileData();
    const { pageProfile } = useProfileData();
    const [profile] = pageProfile.results;
    const is_owner = currentUser?.username === profile?.owner;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [{ data: pageProfile }, { data: profilePosts }] = await Promise.all([
                    axiosReq.get(`/profiles/${id}/`),
                    axiosReq.get(`/posts/?owner__profile=${id}`),
                ]);
                setProfileData((prevState) => ({
                    ...prevState,
                    pageProfile: { results: [pageProfile] },
                }));
                setProfilePosts(profilePosts);
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id, setProfileData]);

    const mainProfile = (
        <>
            <Row noGutters className="px-3 text-center align-items-center">
                <Col lg={12}>
                    <Row className="justify-content-between align-items-center">
                        <Col xs={3} className="text-left">
                            <Image
                                className={styles.ProfileImage}
                                roundedCircle
                                src={profile?.image}
                            />
                        </Col>
                        <Col xs={6} className="text-center">
                            <h3 className="m-2">{profile?.owner}</h3>
                        </Col>
                        <Col xs={3} className="text-right">
                            {currentUser &&
                                !is_owner &&
                                (profile?.following_id ? (
                                    <Button className={`${btnStyles.Button} ${styles.button}`} onClick={() => { }}>
                                        Unfollow
                                    </Button>
                                ) : (
                                    <Button className={`${btnStyles.Button} ${styles.button}`} onClick={() => { }}>
                                        Follow
                                    </Button>
                                ))}
                        </Col>
                    </Row>
                </Col>
                {profile?.content && <Col className="p-3">{profile.content}</Col>}
            </Row>
            <Row noGutters className="justify-content-center">
                <Col xs={3} className="text-center">
                    <div>{profile?.posts_count}</div>
                    <div>Posts</div>
                </Col>
                <Col xs={3} className="text-center">
                    <div>{profile?.followers_count}</div>
                    <div>Followers</div>
                </Col>
                <Col xs={3} className="text-center">
                    <div>{profile?.following_count}</div>
                    <div>Following</div>
                </Col>
            </Row>
        </>
    );


    const mainProfilePosts = (
        <>
            <hr />
            <p className="text-center">{profile?.owner}'s posts</p>
            <hr />
            {profilePosts.results.length ? (
                <InfiniteScroll
                    children={profilePosts.results.map((post) => (
                        <Post key={post.id} {...post} setPosts={setProfilePosts} />
                    ))}
                    dataLength={profilePosts.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!profilePosts.next}
                    next={() => fetchMoreData(profilePosts, setProfilePosts)}
                />
            ) : (
                <Asset
                    src={NoResults}
                    message={`No results: ${profile?.owner} hasn't posted yet.`}
                />
            )}
        </>
    );

    return (
        <Row>
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <PopularProfiles mobile />
                <Container className={appStyles.Content}>
                    {hasLoaded ? (
                        <>
                            {mainProfile}
                            {mainProfilePosts}
                        </>
                    ) : (
                        <Asset spinner />
                    )}
                </Container>
            </Col>
            <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                <PopularProfiles />
            </Col>
        </Row>
    );
}

export default ProfilePage;